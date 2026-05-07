import { Hono } from "hono";
import * as bcrypt from "bcrypt";
import * as z from "zod";
import db from "../lib/db";
import {
	generateTokens,
	setAccessTokenCookie,
	clearAccessTokenCookie,
} from "../lib/jwt";
import { sendActivationEmail, sendResetPasswordEmail } from "../lib/email";
import { checkAuth, requireUser } from "../lib/middlewares";
import { rateLimit, tryConsume } from "../lib/rateLimit";
import { logger } from "../lib/logger";
import {
	validator as zValidator,
	resolver,
	describeRoute,
} from "hono-openapi";

const APP_URL = process.env.APP_URL || "/";

const router = new Hono();

// Apply auth check middleware to all routes
router.use("*", checkAuth);

// GET CURRENT USER INFO

const errorMessageSchema = z.object({
	error: z.string(),
});

const userInfoSchema = z.object();

const passwordSchema = z
	.string({ error: "Password is required" })
	.min(8, { message: "Password must be at least 8 characters long" })
	.refine((password) => /[A-Z]/.test(password), {
		message: "Password must have at least one uppercase letter",
	})
	.refine((password) => /[a-z]/.test(password), {
		message: "Password must have at least one lowercase letter",
	})
	.refine((password) => /[0-9]/.test(password), {
		message: "Must contain a number",
	})
	.refine((password) => /[^A-Za-z0-9]/.test(password), {
		message: "Must contain at least one special character",
	});


router.get("/user", describeRoute({
	description: 'If the user is authenticated, returns the user information along with current token.',
	responses: {
		201: {
			description: "Successful response",
			content: {
				"application/json": {
					schema: resolver(userInfoSchema),
				},
			},
		},
		401: {
			description: "Unauthorized",
			content: {
				"application/json": {
					schema: resolver(errorMessageSchema),
				},
			},
		},
		500: {
			description: "Internal error",
			content: {
				"application/json": {
					schema: resolver(errorMessageSchema),
				},
			},
		}
	}
}), (c) => {
	try {
		const user = c.get("user") || null;
		console.log("user", user);
		if (!user) {
			return c.json({ error: "Unauthorized" }, 401);
		}
		const token = c.get("token") || null;
		return c.json({ ...user, token }, 201);
	} catch (error) {
		logger.error(
			"Failed to get user",
			error instanceof Error ? error : undefined,
		);
		return c.json({ error: "Internal error" }, 500);
	}
});

// REGISTER

const registerSchema = z.object({
	email: z.email({ error: "Invalid email address" }),
	password: passwordSchema
})

const registerSuccessSchema = z.object({
	uid: z.string(),
})

router.post("/register",
	describeRoute({
		description: 'Register a new user with email and password.',
		responses: {
			200: {
				description: "Successful response",
				content: {
					"application/json": {
						schema: resolver(registerSuccessSchema),
					},
				},
			},
			400: {
				description: "Missing email or password",
				content: {
					"application/json": {
						schema: resolver(errorMessageSchema),
					},
				},
			},
			409: {
				description: "User Already Exists",
				content: {
					"application/json": {
						schema: resolver(errorMessageSchema),
					},
				},
			},
			500: {
				description: "Internal error",
				content: {
					"application/json": {
						schema: resolver(errorMessageSchema),
					},
				},
			}
		}
	}), zValidator("json", registerSchema), async (c) => {
		try {
			const { email, password } = c.req.valid("json");
			if (!email || !password) {
				return c.json(
					{
						error: { message: "You must provide an email and a password." },
					},
					400,
				);
			}

			const existingUser = await db.findUserByEmail(email);
			if (existingUser) {
				console.log("User already exists with email", email);
				logger.warn("Registration attempted with existing email", {
					email: email.replace(/(.{2}).*@/, "$1***@"),
				});
				return c.json({ error: { message: "Email already in use." } }, 409);
			}

			const user = await db.createUserByEmailAndPassword({ email, password });
			const pin = await db.createCode(user.id);

			console.log("User registered, sending activation email", email);
			logger.info("User registered, sending activation email", {
				userId: user.id,
				email: email.replace(/(.{2}).*@/, "$1***@"),
			});

			await sendActivationEmail(user, pin);

			return c.json({ uid: user.id }, 200);
		} catch (err) {
			logger.error("Registration failed", err instanceof Error ? err : undefined);
			return c.json({ error: { message: "Registration failed" } }, 500);
		}
	});

// LOGIN

const loginSchema = z.object({
	email: z.email({ error: "Invalid email address" }),
	password: z.string({ error: "Password is required" }),
});

const loginSuccessSchema = z.object({ auth: z.boolean() });

// Per-IP guard sized for office NATs (many users behind the same address).
// The real brute-force protection is the per-email throttle below.
const loginIpRateLimit = rateLimit({
	name: "auth:login:ip",
	windowMs: 15 * 60 * 1000,
	max: 500,
});

router.post("/login",
	describeRoute({
		description: "Authenticate with email and password. Sets an access_token cookie on success.",
		responses: {
			200: { description: "Logged in", content: { "application/json": { schema: resolver(loginSuccessSchema) } } },
			401: { description: "Invalid credentials or unverified email", content: { "application/json": { schema: resolver(errorMessageSchema) } } },
			429: { description: "Too many requests", content: { "application/json": { schema: resolver(errorMessageSchema) } } },
			500: { description: "Internal error", content: { "application/json": { schema: resolver(errorMessageSchema) } } },
		},
	}),
	loginIpRateLimit,
	zValidator("json", loginSchema), async (c) => {
	try {
		const { email, password } = c.req.valid("json");

		// Per-account guard: caps attempts for the same email even if the
		// attacker rotates IPs.
		const perEmail = tryConsume("auth:login:email", email.toLowerCase(), {
			windowMs: 15 * 60 * 1000,
			max: 10,
		});
		if (!perEmail.ok) {
			c.header("Retry-After", `${perEmail.retryAfterSec}`);
			logger.warn("Login rate-limited by email", {
				email: email.replace(/(.{2}).*@/, "$1***@"),
				retryAfterSec: perEmail.retryAfterSec,
			});
			return c.json({ error: { message: "Too many attempts. Try again later." } }, 429);
		}

		const existingUser = await db.findUserByEmail(email);

		if (!existingUser) {
			console.log("No user found with email", email);
			logger.warn("Login attempt for non-existent user", {
				email: email.replace(/(.{2}).*@/, "$1***@"),
			});
			return c.json({ error: { message: "Invalid login credentials." } }, 401);
		}

		//check if user is verifyed
		if (!existingUser.verifyed) {
			console.log("User not verified", email);
			logger.warn("Login attempt for unverified user", {
				userId: existingUser.id,
				email: email.replace(/(.{2}).*@/, "$1***@"),
			});
			return c.json(
				{ error: { message: "Please verify your email before logging in." } },
				401,
			);
		}

		const validPassword = await bcrypt.compare(password, existingUser.password);
		if (!validPassword) {
			console.log("Invalid password for user", email);
			logger.warn("Login failed - invalid password", {
				userId: existingUser.id,
				email: email.replace(/(.{2}).*@/, "$1***@"),
			});
			return c.json({ error: { message: "Invalid login credentials." } }, 401);
		}

		const { accessToken } = generateTokens(existingUser);
		setAccessTokenCookie(c, accessToken);
		console.log("User logged in successfully", email);
		logger.info("User logged in successfully", {
			userId: existingUser.id,
			email: email.replace(/(.{2}).*@/, "$1***@"),
		});

		return c.json({ auth: true });
	} catch (error) {
		logger.error("Login failed", error instanceof Error ? error : undefined);
		return c.json({ error: { message: "Login failed" } }, 500);
	}
});

// RECOVER ACCOUNT

const recoverSchema = z.object({
	email: z.email({ error: "Invalid email address" }),
});

// Sized for office NATs. Per-email throttle (below) is the real guard
// against flooding any single mailbox.
const recoverIpRateLimit = rateLimit({
	name: "auth:recover:ip",
	windowMs: 60 * 60 * 1000,
	max: 100,
});

router.post("/recover",
	describeRoute({
		description: "Request a password reset email. Always returns success to prevent email enumeration.",
		responses: {
			200: { description: "Recovery email sent (or silently ignored)", content: { "application/json": { schema: resolver(z.boolean()) } } },
			429: { description: "Too many requests", content: { "application/json": { schema: resolver(errorMessageSchema) } } },
		},
	}),
	recoverIpRateLimit,
	zValidator("json", recoverSchema), async (c) => {
	clearAccessTokenCookie(c);
	const { email } = c.req.valid("json");

	logger.info("Password recovery requested", {
		email: email.replace(/(.{2}).*@/, "$1***@"),
	});

	// Throttle per-mailbox so an attacker can't flood a target inbox
	// even by varying the source IP. Sized to tolerate a confused user
	// repeatedly clicking "forgot password".
	const perEmail = tryConsume("auth:recover:email", email.toLowerCase(), {
		windowMs: 60 * 60 * 1000,
		max: 10,
	});
	if (!perEmail.ok) {
		// Silent success — keep the email-enumeration guarantee identical
		// to the normal path.
		return c.json(true, 200);
	}

	const user = await db.findUserByEmail(email);
	if (user) {
		const pin = await db.createCode(user.id);
		await sendResetPasswordEmail(user, pin);
	}
	// Always return success to prevent email enumeration
	return c.json(true, 200);
});

// RESEND ACTIVATION EMAIL

const resendSchema = z.object({
	email: z.email({ error: "Invalid email address" }),
});

const resendIpRateLimit = rateLimit({
	name: "auth:resend:ip",
	windowMs: 60 * 60 * 1000,
	max: 100,
});

router.post("/resend",
	describeRoute({
		description: "Re-send the activation email to an unverified user. Always returns success to prevent email enumeration.",
		responses: {
			200: { description: "Activation email sent (or silently ignored)", content: { "application/json": { schema: resolver(z.boolean()) } } },
			429: { description: "Too many requests", content: { "application/json": { schema: resolver(errorMessageSchema) } } },
		},
	}),
	resendIpRateLimit,
	zValidator("json", resendSchema), async (c) => {
	const { email } = c.req.valid("json");

	logger.info("Activation resend requested", {
		email: email.replace(/(.{2}).*@/, "$1***@"),
	});

	const perEmail = tryConsume("auth:resend:email", email.toLowerCase(), {
		windowMs: 60 * 60 * 1000,
		max: 5,
	});
	if (!perEmail.ok) {
		return c.json(true, 200);
	}

	const user = await db.findUserByEmail(email);
	// Re-send only if the account exists AND is still unverified.
	// Already-verified accounts must use /recover for password resets.
	if (user && !user.verifyed) {
		const pin = await db.createCode(user.id);
		await sendActivationEmail(user, pin);
	}
	// Always return success to prevent email enumeration
	return c.json(true, 200);
});

// LOGOUT

router.get("/logout",
	describeRoute({
		description: "Clear the access_token cookie and log the user out.",
		responses: {
			200: { description: "Logged out", content: { "application/json": { schema: resolver(z.boolean()) } } },
		},
	}),
	(c) => {
	const user = c.get("user") as any;
	logger.info("User logged out", { userId: user?.userId });
	clearAccessTokenCookie(c);
	return c.json(true, 200);
});

// VERIFY CODE

const verifySchema = z.object({
	uid: z.string({
		error: "uid is required",
	}),
	code: z.string({ error: "code is required" }),
});

const authSuccessSchema = z.object({ auth: z.boolean() });

// PIN is a 6-digit code (10^6 combinations). The per-uid throttle
// below is the real anti-brute-force guard; per-IP is sized for
// office NATs so legit users aren't blocked.
const verifyIpRateLimit = rateLimit({
	name: "auth:verify:ip",
	windowMs: 15 * 60 * 1000,
	max: 300,
});

router.post("/verify",
	describeRoute({
		description: "Verify a user account using the PIN sent to their email.",
		responses: {
			200: { description: "Verified and logged in", content: { "application/json": { schema: resolver(authSuccessSchema) } } },
			400: { description: "Invalid or expired code", content: { "application/json": { schema: resolver(errorMessageSchema) } } },
			401: { description: "Unauthorized", content: { "application/json": { schema: resolver(errorMessageSchema) } } },
			429: { description: "Too many requests", content: { "application/json": { schema: resolver(errorMessageSchema) } } },
		},
	}),
	verifyIpRateLimit,
	zValidator("json", verifySchema), async (c) => {
	const { uid, code } = c.req.valid("json");

	if (!uid || !code) {
		return c.json({ error: "Invalid user activation." }, 401);
	}

	// Per-uid throttle defends against PIN guessing for a specific account
	// even when the attacker rotates IPs.
	const perUid = tryConsume("auth:verify:uid", uid, {
		windowMs: 15 * 60 * 1000,
		max: 10,
	});
	if (!perUid.ok) {
		c.header("Retry-After", `${perUid.retryAfterSec}`);
		logger.warn("Verify rate-limited by uid", {
			userId: uid,
			retryAfterSec: perUid.retryAfterSec,
		});
		return c.json({ error: "Too many attempts. Try again later." }, 429);
	}

	const user = c.get("user") as any;
	if (user && user.id !== uid) {
		logger.warn("Verification attempted with mismatched user", {
			requestUserId: uid,
			sessionUserId: user.id,
		});
		return c.json({ error: "Invalid user activation." }, 400);
	}

	const dbUser = await db.findUserById(uid);
	if (!dbUser) {
		logger.warn("Verification attempted for non-existent user", {
			userId: uid,
		});
		return c.json({ error: "User not found." }, 400);
	}

	const pin = await db.findCodeByUid(uid);
	if (!pin) {
		logger.warn("Verification failed - code not found", { userId: uid });
		return c.json({ error: "Code invalid or expired." }, 400);
	}

	if (`${pin}`.trim() !== `${code}`.trim()) {
		logger.warn("Verification failed - code mismatch", { userId: uid });
		return c.json({ error: "Code invalid or expired." }, 400);
	}

	const userValue = await db.setVerifyed(dbUser.id);
	await db.destroyCodes(dbUser.id);

	const { accessToken } = generateTokens(userValue);
	setAccessTokenCookie(c, accessToken);

	logger.info("User verified successfully", { userId: uid });

	return c.json({ auth: true });
});

// CONFIRM EMAIL

const confirmSchema = z.object({
	uid: z.string({
		error: "uid is required",
	}),
	code: z.string({ error: "code is required" }),
});

router.get(
	"/confirm/:uid/:code",
	describeRoute({
		description: "Confirm email via link (redirects to app on success).",
		responses: {
			302: { description: "Redirect to app after successful confirmation" },
			400: { description: "Invalid or expired code", content: { "application/json": { schema: resolver(errorMessageSchema) } } },
			401: { description: "Unauthorized", content: { "application/json": { schema: resolver(errorMessageSchema) } } },
		},
	}),
	zValidator("param", confirmSchema),
	async (c) => {
		const { uid, code } = c.req.valid("param");

		if (!uid || !code) {
			return c.json({ error: "Invalid confirmation" }, 401);
		}

		const user = c.get("user") as any;
		if (user && user.userId !== uid) {
			logger.warn("Email confirmation attempted with mismatched user", {
				requestUserId: uid,
				sessionUserId: user.userId,
			});
			return c.json({ error: "Invalid user activation." }, 400);
		}

		const dbUser = await db.findUserById(uid);
		if (!dbUser) {
			logger.warn("Email confirmation for non-existent user", { userId: uid });
			return c.json({ error: "User not found." }, 400);
		}

		const pin = await db.findCodeByUid(uid);
		if (!pin || pin !== code) {
			logger.warn("Email confirmation failed - invalid code", { userId: uid });
			return c.json({ error: "Code invalid or expired." }, 400);
		}

		const userValue = await db.setVerifyed(dbUser.id);
		await db.destroyCodes(dbUser.id);
		const { accessToken } = generateTokens(userValue);
		setAccessTokenCookie(c, accessToken);

		logger.info("Email confirmed successfully", { userId: uid });

		return c.redirect(APP_URL);
	},
);

// CHANGE PASSWORD



const changePwdSchema = z.object({
	password: passwordSchema,
});

router.put(
	"/pwd",
	describeRoute({
		description: "Change the current user's password. Requires an active session.",
		responses: {
			204: { description: "Password changed successfully" },
			400: { description: "Missing user or password", content: { "application/json": { schema: resolver(errorMessageSchema) } } },
			401: { description: "Unauthorized", content: { "application/json": { schema: resolver(errorMessageSchema) } } },
		},
	}),
	requireUser,
	zValidator("json", changePwdSchema),
	async (c) => {
		const user = c.get("user") as any;
		const { password } = c.req.valid("json");

		if (!user || !password) {
			return c.json({ error: "User and password are required." }, 400);
		}

		await db.changePassword(user.userId, password);
		logger.info("Password changed successfully", { userId: user.userId });

		return c.body(null, 204);
	},
);

export default router;
