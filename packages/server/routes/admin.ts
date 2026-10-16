import { Hono } from "hono";
import { describeRoute, resolver, validator as zValidator } from "hono-openapi";
import * as z from "zod";
import db from "../lib/db";
import { MergeError } from "../lib/db/userMergeDb";
import { sendActivationEmail, sendResetPasswordEmail } from "../lib/email";
import { checkAuth, requireUser, requireAdmin } from "../lib/middlewares";
import { logger } from "../lib/logger";
import { requirePasswordAuth } from "../lib/passwordAuth";
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
	requirePasswordAuth,
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
	requirePasswordAuth,
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

// PATCH /admin/users/:id/role — promote to / demote from ADMIN
const roleSchema = z.object({ role: z.enum(["USER", "ADMIN"]) });

router.patch(
	"/users/:id/role",
	describeRoute({
		description: "Change a user's role (USER/ADMIN). Admin only. The role travels in the session token, so the change applies at the user's next sign-in.",
		responses: {
			200: { description: "Role changed" },
			400: { description: "Cannot change your own role, or would remove the last admin", content: { "application/json": { schema: resolver(errorMessageSchema) } } },
			404: { description: "User not found" },
		},
	}),
	zValidator("param", paramsSchema),
	zValidator("json", roleSchema),
	async (c) => {
		const { id } = c.req.valid("param");
		const { role } = c.req.valid("json");
		const caller = c.get("user") as ParsedToken;

		// Mirrors the delete guard: an admin cannot lock themselves out.
		if (caller.userId === id) {
			return c.json({ error: "Cannot change your own role." }, 400);
		}

		try {
			const target = await db.findUserById(id);
			if (!target) return c.json({ error: "User not found." }, 404);
			if (target.role === role) return c.json({ ok: true, role }, 200);

			if (role === "USER" && (await db.countAdmins()) <= 1) {
				return c.json({ error: "Cannot remove the last admin." }, 400);
			}

			await db.setUserRole(id, role);
			logger.info("Admin: user role changed", { targetUserId: id, role, byAdmin: caller.userId });
			return c.json({ ok: true, role }, 200);
		} catch (err) {
			logger.error("Admin: failed to change role", err instanceof Error ? err : undefined);
			return c.json({ error: "Internal error" }, 500);
		}
	},
);

// GET /admin/users/duplicates — accounts whose emails differ only by case
router.get(
	"/users/duplicates",
	describeRoute({
		description: "List groups of accounts whose emails differ only by case. Admin only.",
		responses: { 200: { description: "Duplicate groups (empty when there are none)" } },
	}),
	async (c) => {
		try {
			return c.json(await db.findDuplicateEmailGroups(), 200);
		} catch (err) {
			logger.error("Admin: failed to list duplicate emails", err instanceof Error ? err : undefined);
			return c.json({ error: "Internal error" }, 500);
		}
	},
);

// POST /admin/users/merge — fold duplicate accounts into the one to keep
const mergeSchema = z.object({
	keepId: z.string().min(1),
	mergeIds: z.array(z.string().min(1)).min(1),
});

router.post(
	"/users/merge",
	describeRoute({
		description: "Merge accounts sharing the same email (case-insensitive) into keepId: projects, memberships and SPID/CIE identities move to it, the others are deleted. Admin only.",
		responses: {
			200: { description: "Accounts merged" },
			400: { description: "Invalid merge (different emails, unknown users, or your own account would be deleted)", content: { "application/json": { schema: resolver(errorMessageSchema) } } },
		},
	}),
	zValidator("json", mergeSchema),
	async (c) => {
		const { keepId, mergeIds } = c.req.valid("json");
		const caller = c.get("user") as ParsedToken;

		if (mergeIds.includes(caller.userId)) {
			return c.json({ error: "Cannot merge away your own account: keep it instead." }, 400);
		}

		try {
			const kept = await db.mergeUsers(keepId, mergeIds);
			logger.info("Admin: users merged", { keptUserId: kept.id, mergedUserIds: mergeIds, byAdmin: caller.userId });
			return c.json({ ok: true, id: kept.id, email: kept.email }, 200);
		} catch (err) {
			if (err instanceof MergeError) return c.json({ error: err.message }, 400);
			logger.error("Admin: failed to merge users", err instanceof Error ? err : undefined);
			return c.json({ error: "Internal error" }, 500);
		}
	},
);

export default router;
