import { Hono } from "hono";
import { describeRoute, resolver, validator as zValidator } from "hono-openapi";
import * as z from "zod";
import db from "../lib/db";
import { sendActivationEmail, sendResetPasswordEmail } from "../lib/email";
import { checkAuth, requireUser, requireAdmin } from "../lib/middlewares";
import { logger } from "../lib/logger";
import type { ParsedToken } from "../types";

const router = new Hono();

router.use("*", checkAuth, requireUser, requireAdmin);

const errorMessageSchema = z.object({ error: z.string() });
const paramsSchema = z.object({ id: z.string().min(1, "Invalid id") });

// GET /admin/users — list all users
router.get(
	"/users",
	describeRoute({
		description: "List all users. Admin only.",
		responses: {
			200: { description: "User list" },
			401: { description: "Unauthorized", content: { "application/json": { schema: resolver(errorMessageSchema) } } },
			403: { description: "Forbidden", content: { "application/json": { schema: resolver(errorMessageSchema) } } },
		},
	}),
	async (c) => {
		try {
			const users = await db.getAllUsersForAdmin();
			return c.json(users, 200);
		} catch (err) {
			logger.error("Admin: failed to list users", err instanceof Error ? err : undefined);
			return c.json({ error: "Internal error" }, 500);
		}
	},
);

// DELETE /admin/users/:id — delete a user
router.delete(
	"/users/:id",
	describeRoute({
		description: "Delete a user by id. Admin only.",
		responses: {
			200: { description: "User deleted" },
			400: { description: "Cannot delete your own account" },
			404: { description: "User not found" },
		},
	}),
	zValidator("param", paramsSchema),
	async (c) => {
		const { id } = c.req.valid("param");
		const caller = c.get("user") as ParsedToken;

		if (caller.userId === id) {
			return c.json({ error: "Cannot delete your own account." }, 400);
		}

		try {
			const target = await db.findUserById(id);
			if (!target) return c.json({ error: "User not found." }, 404);

			await db.destroyCodes(id);
			await db.deleteUserById(id);

			logger.info("Admin: user deleted", { targetUserId: id, byAdmin: caller.userId });
			return c.json({ ok: true }, 200);
		} catch (err) {
			logger.error("Admin: failed to delete user", err instanceof Error ? err : undefined);
			return c.json({ error: "Internal error" }, 500);
		}
	},
);

// POST /admin/users/:id/activate — force-activate a user
router.post(
	"/users/:id/activate",
	describeRoute({
		description: "Force-activate (verify) a user account. Admin only.",
		responses: {
			200: { description: "User activated" },
			404: { description: "User not found" },
		},
	}),
	zValidator("param", paramsSchema),
	async (c) => {
		const { id } = c.req.valid("param");
		const caller = c.get("user") as ParsedToken;

		try {
			const target = await db.findUserById(id);
			if (!target) return c.json({ error: "User not found." }, 404);

			await db.setVerified(id);
			logger.info("Admin: user activated", { targetUserId: id, byAdmin: caller.userId });
			return c.json({ ok: true }, 200);
		} catch (err) {
			logger.error("Admin: failed to activate user", err instanceof Error ? err : undefined);
			return c.json({ error: "Internal error" }, 500);
		}
	},
);

// POST /admin/users/:id/resend-activation — resend activation email
router.post(
	"/users/:id/resend-activation",
	describeRoute({
		description: "Resend the activation email to an unverified user. Admin only.",
		responses: {
			200: { description: "Activation email sent" },
			400: { description: "User is already verified" },
			404: { description: "User not found" },
		},
	}),
	zValidator("param", paramsSchema),
	async (c) => {
		const { id } = c.req.valid("param");
		const caller = c.get("user") as ParsedToken;

		try {
			const target = await db.findUserById(id);
			if (!target) return c.json({ error: "User not found." }, 404);
			if (target.verified) return c.json({ error: "User is already verified." }, 400);

			const pin = await db.createCode(id, "ACTIVATION");
			await sendActivationEmail(target, pin);

			logger.info("Admin: resent activation email", { targetUserId: id, byAdmin: caller.userId });
			return c.json({ ok: true }, 200);
		} catch (err) {
			logger.error("Admin: failed to resend activation", err instanceof Error ? err : undefined);
			return c.json({ error: "Internal error" }, 500);
		}
	},
);

// POST /admin/users/:id/reset-password — send password reset email
router.post(
	"/users/:id/reset-password",
	describeRoute({
		description: "Send a password reset email to a user. Admin only.",
		responses: {
			200: { description: "Password reset email sent" },
			404: { description: "User not found" },
		},
	}),
	zValidator("param", paramsSchema),
	async (c) => {
		const { id } = c.req.valid("param");
		const caller = c.get("user") as ParsedToken;

		try {
			const target = await db.findUserById(id);
			if (!target) return c.json({ error: "User not found." }, 404);

			const pin = await db.createCode(id, "RECOVERY");
			await sendResetPasswordEmail(target, pin);

			logger.info("Admin: sent password reset email", { targetUserId: id, byAdmin: caller.userId });
			return c.json({ ok: true }, 200);
		} catch (err) {
			logger.error("Admin: failed to send password reset", err instanceof Error ? err : undefined);
			return c.json({ error: "Internal error" }, 500);
		}
	},
);

export default router;
