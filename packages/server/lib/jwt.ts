import crypto from "crypto";
import { setCookie, deleteCookie } from "hono/cookie";
import type { Context } from "hono";
import { sign, verify } from "jsonwebtoken";
import type { User } from "@prisma/client";
import { logger } from "./logger";

const JWT_SECRET = process?.env["JWT_SECRET"] || "";
// const EXPIRE = 60; //seconds
const EXPIRE = "1d";

export interface IAccessTokenPayload {
	userId: User["id"];
	name: User["email"];
}
export interface IRefreshTokenPayload {
	userId: User["id"];
	jti: string;
}

// Usually I keep the token between 5 minutes - 15 minutes
export function generateAccessToken(
	payload: IAccessTokenPayload,
	expiresIn: string | number = EXPIRE,
) {
	logger.debug("Generating access token", {
		userId: payload.userId,
		expiresIn,
	});
	return sign(payload, JWT_SECRET, {
		expiresIn,
	});
}

export function generateTokens(user: User) {
	const accessTokenPayload: IAccessTokenPayload = {
		userId: user.id,
		name: user.email,
	};
	const accessToken = generateAccessToken(accessTokenPayload);
	return { accessToken };
}

export function verifyAccessToken(token: string) {
	try {
		return verify(token, JWT_SECRET) as IAccessTokenPayload;
	} catch (error) {
		logger.warn("Token verification failed", {
			error: error instanceof Error ? error.message : "Unknown error",
		});
		throw error;
	}
}

export function hashToken(token: string) {
	return crypto.createHash("sha512").update(token).digest("hex");
}

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
