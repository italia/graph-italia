import crypto from "crypto";
import type { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { sign, verify } from "jsonwebtoken";
import { isSecureCookie } from "./jwt";

/**
 * Email verification for SPID/CIE signups whose identity provider sent no
 * email (CIE never does, SPID not always). The account may not exist yet, so
 * the state lives in a short-lived signed cookie bound to the OIDC `sub`
 * rather than in VerificationCode (which belongs to a user):
 *
 *   1. pending  — { sub, email, codeHmac }: a PIN was mailed to `email`.
 *   2. verified — { sub, email, verified }: the PIN matched; signup may use it.
 *
 * The PIN is stored as an HMAC keyed with the server secret, never in clear
 * or as a plain hash: the cookie is readable by its holder, and a 6-digit
 * hash would be brute-forced offline in milliseconds.
 */

const COOKIE_NAME = "oidc-email";
const TOKEN_TYPE = "oidc-email";
export const PENDING_TTL_SEC = 15 * 60;
export const VERIFIED_TTL_SEC = 30 * 60;

export interface EmailVerification {
	sub: string;
	email: string;
	codeHmac?: string;
	verified?: boolean;
}

const secret = () => process.env.JWT_SECRET || "";

function hmacCode(sub: string, email: string, code: string) {
	return crypto.createHmac("sha256", secret()).update(`${sub}:${email}:${code.trim()}`).digest("hex");
}

function writeCookie(c: Context, data: EmailVerification, ttlSec: number) {
	const token = sign({ typ: TOKEN_TYPE, ...data }, secret(), { expiresIn: ttlSec });
	setCookie(c, COOKIE_NAME, token, {
		httpOnly: true,
		sameSite: "Lax",
		secure: isSecureCookie(),
		path: "/",
		maxAge: ttlSec,
	});
}

/** Starts (or restarts) verification of `email` for `sub` with a freshly mailed PIN. */
export function setPendingEmailVerification(c: Context, sub: string, email: string, code: string) {
	writeCookie(c, { sub, email, codeHmac: hmacCode(sub, email, code) }, PENDING_TTL_SEC);
}

/** Records that `sub` proved ownership of `email`. */
export function setVerifiedEmail(c: Context, sub: string, email: string) {
	writeCookie(c, { sub, email, verified: true }, VERIFIED_TTL_SEC);
}

/** Reads the verification state for `sub`; null if missing, expired, tampered or for another subject. */
export function readEmailVerification(c: Context, sub: string): EmailVerification | null {
	const token = getCookie(c, COOKIE_NAME);
	if (!token) return null;
	try {
		const payload = verify(token, secret()) as EmailVerification & { typ?: string };
		// typ keeps other tokens signed with the same secret (access tokens) from
		// being replayed here; sub binds the state to the current OIDC session.
		if (payload.typ !== TOKEN_TYPE || payload.sub !== sub || !payload.email) return null;
		return { sub: payload.sub, email: payload.email, codeHmac: payload.codeHmac, verified: payload.verified === true };
	} catch {
		return null;
	}
}

export function emailCodeMatches(state: EmailVerification, code: string) {
	if (!state.codeHmac) return false;
	const expected = Buffer.from(state.codeHmac, "hex");
	const actual = Buffer.from(hmacCode(state.sub, state.email, code), "hex");
	return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

export function clearEmailVerification(c: Context) {
	deleteCookie(c, COOKIE_NAME, { path: "/" });
}
