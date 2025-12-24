import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import * as bcrypt from "bcrypt";
import * as z from "zod";
import db from "../lib/db";
import {
	generateTokens,
	setAccessTokenCookie,
	clearAccessTokenCookie,
} from "../lib/jwt-hono";
import { sendActivationEmail, sendResetPasswordEmail } from "../lib/email";
import { checkAuth, requireUser } from "../lib/middlewares-hono";
import { logger } from "../lib/logger";

const APP_URL = process.env.APP_URL || "/";

const router = new Hono();

// Apply auth check middleware to all routes
router.use("*", checkAuth);

// GET CURRENT USER INFO

router.get("/user", (c) => {
	try {
		const user = c.get("user") || null;
		if (!user) {
			return c.json(null, 401);
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
	password: z
		.string({ error: "Password is required" })
		.min(7, "Password must be at least 7 characters long"),
});

router.post("/register", zValidator("json", registerSchema), async (c) => {
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
			logger.warn("Registration attempted with existing email", {
				email: email.replace(/(.{2}).*@/, "$1***@"),
			});
			return c.json({ error: { message: "Email already in use." } }, 409);
		}

		const user = await db.createUserByEmailAndPassword({ email, password });
		const pin = await db.createCode(user.id);

		logger.info("User registered, sending activation email", {
			userId: user.id,
			email: email.replace(/(.{2}).*@/, "$1***@"),
		});

		await sendActivationEmail(user, pin);

		return c.json({ auth: true }, 200);
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
			logger.warn("Login attempt for non-existent user", {
				email: email.replace(/(.{2}).*@/, "$1***@"),
			});
			return c.json({ error: { message: "Invalid login credentials." } }, 401);
		}

		const validPassword = await bcrypt.compare(password, existingUser.password);
		if (!validPassword) {
			logger.warn("Login failed - invalid password", {
				userId: existingUser.id,
				email: email.replace(/(.{2}).*@/, "$1***@"),
			});
			return c.json({ error: { message: "Invalid login credentials." } }, 401);
		}

		const { accessToken } = generateTokens(existingUser);
		setAccessTokenCookie(c, accessToken);

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
