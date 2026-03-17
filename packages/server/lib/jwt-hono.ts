import { setCookie, deleteCookie } from "hono/cookie";
import type { Context } from "hono";
import {
	generateTokens,
	generateAccessToken,
	verifyAccessToken,
	hashToken,
} from "./jwt";
import { logger } from "./logger";
import type { IAccessTokenPayload, IRefreshTokenPayload } from "./jwt";

// Re-export common functions
export { generateTokens, generateAccessToken, verifyAccessToken, hashToken };
export type { IAccessTokenPayload, IRefreshTokenPayload };

export function setAccessTokenCookie(c: Context, token: string) {
	const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
	const isProduction = process.env.NODE_ENV === "production";

	setCookie(c, "access_token", token, {
		expires,
		httpOnly: true,
		sameSite: "Lax",
		secure: isProduction,
		path: "/",
	});
	logger.debug("Access token cookie set", { expires: expires.toISOString() });
}

export function clearAccessTokenCookie(c: Context) {
	deleteCookie(c, "access_token", {
		path: "/",
	});
	logger.debug("Access token cookie cleared");
}
