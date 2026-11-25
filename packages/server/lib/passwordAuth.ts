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

/**
 * Hidden password login (POST /auth/admin/login, webapp page /login/admin, not
 * linked anywhere): email/password sign-in that keeps working when
 * ENABLE_PASSWORD_AUTH="false" — a way in when SPID/CIE is unavailable, or for
 * accounts not linked to a SPID/CIE identity. While it is enabled, password
 * recovery and change stay available too (see isPasswordRecoveryEnabled).
 *
 * Defaults to enabled; set ENABLE_ADMIN_PASSWORD_LOGIN="false" to make the
 * endpoint answer 404.
 */
export function isAdminPasswordLoginEnabled(): boolean {
	return process.env.ENABLE_ADMIN_PASSWORD_LOGIN !== "false";
}

/**
 * ADMIN_PASSWORD_LOGIN_ADMINS_ONLY="true" restricts the hidden login to ADMIN
 * accounts (DB role or ADMIN_EMAILS): everyone else gets the same answer as a
 * wrong password. Off by default: any account with a password can sign in.
 */
export function isAdminPasswordLoginAdminsOnly(): boolean {
	return process.env.ADMIN_PASSWORD_LOGIN_ADMINS_ONLY === "true";
}

/**
 * Password recovery (POST /auth/recover, /auth/reset-password) and change
 * (PUT /auth/pwd): available with email/password authentication, and on
 * SPID/CIE-only instances as long as the hidden login is enabled — without
 * them an account whose password is forgotten has no way back in.
 */
export function isPasswordRecoveryEnabled(): boolean {
	return isPasswordAuthEnabled() || isAdminPasswordLoginEnabled();
}

/** Rejects the request with 403 when password recovery/change is off. */
export const requirePasswordRecovery = createMiddleware(async (c, next) => {
	if (!isPasswordRecoveryEnabled()) {
		return c.json({ error: "Password recovery is disabled: sign in with SPID/CIE." }, 403);
	}
	await next();
});

/** Rejects the request with 403 when email/password authentication is off. */
export const requirePasswordAuth = createMiddleware(async (c, next) => {
	if (!isPasswordAuthEnabled()) {
		return c.json({ error: "Password authentication is disabled: sign in with SPID/CIE." }, 403);
	}
	await next();
});
