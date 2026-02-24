import * as bcrypt from "bcrypt";
import { Hono } from "hono";
import {
	describeRoute,
	resolver,
	validator as zValidator,
} from "hono-openapi";
import * as z from "zod";
import db from "../lib/db";
import { sendActivationEmail, sendResetPasswordEmail } from "../lib/email";
import {
	clearAccessTokenCookie,
	generateTokens,
	setAccessTokenCookie,
} from "../lib/jwt-hono";
import { logger } from "../lib/logger";
import { checkAuth, requireUser } from "../lib/middlewares-hono";

const APP_URL = process.env.APP_URL || "/";

const HOST = process.env.HOST || "http://localhost";
const PORT = process.env.PORT || 3003;

const isDev = process.env.NODE_ENV !== "production";


const router = new Hono();

// // ─── OIDC callback ────────────────────────────────────────────────────────────
// router.get('/oidc/callback', async (c) => {
// 	console.log('→ callback hit')
// 	console.log('→ query params:', c.req.query())
// 	console.log('→ cookies:', c.req.header('cookie'))
// 	try {
// 		await processOAuthCallback(c)
// 		console.log('→ processOAuthCallback completato')
// 	} catch (e) {
// 		console.error('→ errore in processOAuthCallback:', e)
// 		throw e
// 	}
// 	// Dopo il callback, getAuth() ha i dati dell'utente OIDC
// 	const oidcAuth = await getAuth(c)
// 	if (!oidcAuth?.email) return c.json({ error: 'OIDC auth failed' }, 401)

// 	// Trova o crea l'utente nel tuo DB
// 	let user = await db.findUserByEmail(oidcAuth.email)
// 	if (!user) {
// 		user = await db.createUserByEmailAndPassword({
// 			email: oidcAuth.email,
// 			password: crypto.randomUUID(), // password casuale, non usata
// 		})
// 		await db.setVerifyed(user.id) // già verificato via OIDC
// 	}

// 	// Crea la sessione con il tuo sistema JWT esistente
// 	const { accessToken } = generateTokens(user)
// 	setAccessTokenCookie(c, accessToken)

// 	logger.info('User logged in via OIDC', { userId: user.id, email: oidcAuth.email })

// 	return c.redirect(APP_URL)
// })

// // ─── OIDC login ───────────────────────────────────────────────────────────────
// router.use('/oidc/login', (c, next) => {
// 	setCookie(c, 'continue', APP_URL, {
// 		path: '/',
// 		httpOnly: true,
// 		secure: !isDev,
// 	})
// 	return next()
// })

// router.use('/oidc/login', oidcAuthMiddleware())
// router.get('/oidc/login', (c) => c.redirect(APP_URL))

// // ─── OIDC logout ─────────────────────────────────────────────────────────────
// router.get('/oidc/logout', async (c) => {
// 	await revokeSession(c)         // revoca sessione OIDC
// 	clearAccessTokenCookie(c)      // revoca sessione tua
// 	logger.info('User logged out via OIDC')
// 	return c.redirect(APP_URL)
// })

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
	.refine((password) => /[!@#$%^&*]/.test(password), {
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

router.post("/login", zValidator("json", loginSchema), async (c) => {
	try {
		const { email, password } = c.req.valid("json");
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

router.post("/recover", zValidator("json", recoverSchema), async (c) => {
	clearAccessTokenCookie(c);
	const { email } = c.req.valid("json");

	logger.info("Password recovery requested", {
		email: email.replace(/(.{2}).*@/, "$1***@"),
	});

	const user = await db.findUserByEmail(email);
	if (user) {
		const pin = await db.createCode(user.id);
		await sendResetPasswordEmail(user, pin);
	}
	// Always return success to prevent email enumeration
	return c.json(true, 200);
});

// LOGOUT

router.get("/logout", (c) => {
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

router.post("/verify", zValidator("json", verifySchema), async (c) => {
	const { uid, code } = c.req.valid("json");

	if (!uid || !code) {
		return c.json({ error: "Invalid user activation." }, 401);
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
