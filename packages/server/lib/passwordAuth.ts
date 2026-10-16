import { createMiddleware } from "hono/factory";

/**
 * Email/password authentication toggle — single source of truth for the whole
 * platform.
 *
 * When disabled, SPID/CIE (OIDC, see routes/oidc.ts) is the only way in, for
 * both login and signup: the password endpoints under /auth (register, login,
 * activation, recovery, password change) and the admin activation/reset
 * mailers answer 403, and the OIDC signup no longer asks for a password.
 * Session endpoints that are not password-specific (/auth/user, /auth/logout)
 * keep working.
 *
 * Defaults to enabled so self-hosted deployments that never set the variable
 * keep the open source behaviour; set ENABLE_PASSWORD_AUTH="false" to require
 * SPID/CIE. The webapp reads this value from GET /config instead of carrying
 * its own flag.
 */
export function isPasswordAuthEnabled(): boolean {
	return process.env.ENABLE_PASSWORD_AUTH !== "false";
}

/** Rejects the request with 403 when email/password authentication is off. */
export const requirePasswordAuth = createMiddleware(async (c, next) => {
	if (!isPasswordAuthEnabled()) {
		return c.json({ error: "Password authentication is disabled: sign in with SPID/CIE." }, 403);
	}
	await next();
});
