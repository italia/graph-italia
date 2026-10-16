import db from "./db";
import type { User } from "./db/prisma/client";
import { logger } from "./logger";

/**
 * Bootstrap admins from configuration: ADMIN_EMAILS is a comma-separated list
 * of emails (case-insensitive) that receive the ADMIN role when they sign in,
 * through SPID/CIE or email/password. It only grants: removing an email from
 * the list does not demote anyone — use the admin panel for that — so roles
 * changed in the panel are never overridden at the next login.
 *
 * Meant for Helm values / ConfigMaps: no password involved, and it also works
 * for accounts that already exist, which the seed script skips.
 */
export function getAdminEmails(): Set<string> {
	return new Set(
		(process.env.ADMIN_EMAILS ?? "")
			.split(",")
			.map((email) => email.trim().toLowerCase())
			.filter(Boolean),
	);
}

/** Promotes `user` to ADMIN if listed in ADMIN_EMAILS; call it right before issuing a session. */
export async function withAdminEmails(user: User): Promise<User> {
	if (user.role === "ADMIN" || !getAdminEmails().has(user.email.toLowerCase())) return user;
	logger.info("Granting ADMIN role from ADMIN_EMAILS", { userId: user.id });
	return db.setUserRole(user.id, "ADMIN");
}
