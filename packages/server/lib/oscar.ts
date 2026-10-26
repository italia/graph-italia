import { sign, verify } from "jsonwebtoken";
import db from "./db";
import { logger } from "./logger";

/**
 * Verifica, tramite il servizio esterno «Oscar», che un utente appartenga
 * davvero alla Pubblica Amministrazione scelta in registrazione.
 *
 * Attiva solo con ENABLE_OSCAR_PA_VERIFICATION="true" (default spenta), più
 * OSCAR_URL e OSCAR_KEY. Alla creazione di un account SPID/CIE (routes/oidc.ts)
 * inviamo a OSCAR_URL, in POST, l'id dell'utente, nome e cognome da SPID/CIE
 * (non li salviamo) e la PA (codice IPA e denominazione). Oscar risponde più
 * tardi su POST /oscar/pa-verification (routes/oscar.ts) con lo stesso payload
 * più `verified`.
 *
 * Entrambe le chiamate portano un JWT HS256 firmato con OSCAR_KEY, valido 5
 * minuti: noi firmiamo con iss "graph-italia" / aud "oscar", Oscar con
 * iss "oscar" / aud "graph-italia". La chiave non viaggia mai.
 *
 * L'esito finisce in User.paVerified (colonna pa_verified), solo come
 * informazione per gli admin: non cambia l'accesso.
 */

export const PA_VERIFIED = { PENDING: 0, VERIFIED: 1, NOT_MEMBER: 2 } as const;

const OUR_ISSUER = "graph-italia";
const OSCAR_ISSUER = "oscar";
const TOKEN_TTL_SECONDS = 5 * 60;
const REQUEST_TIMEOUT_MS = 10_000;

export function isOscarEnabled(): boolean {
	return process.env.ENABLE_OSCAR_PA_VERIFICATION === "true";
}

function oscarKey(): string {
	return process.env.OSCAR_KEY || "";
}

/** Payload inviato a Oscar; la callback lo rimanda con in più `verified`. */
export type PaVerificationRequest = {
	userId: string;
	firstName: string;
	lastName: string;
	pa: { code: string; name: string };
};

/** Bearer per le nostre chiamate a Oscar. */
export function signOscarRequestToken(key = oscarKey()): string {
	return sign({}, key, {
		algorithm: "HS256",
		issuer: OUR_ISSUER,
		audience: OSCAR_ISSUER,
		expiresIn: TOKEN_TTL_SECONDS,
	});
}

/** Verifica il bearer di una callback di Oscar. */
export function isValidOscarCallbackToken(token: string, key = oscarKey()): boolean {
	if (!key) return false;
	try {
		verify(token, key, { algorithms: ["HS256"], issuer: OSCAR_ISSUER, audience: OUR_ISSUER });
		return true;
	} catch {
		return false;
	}
}

/**
 * Chiede a Oscar di verificare l'appartenenza alla PA. Lo stato passa a «in
 * attesa» prima dell'invio (così una callback velocissima non viene
 * sovrascritta) e torna a «mai richiesta» se l'invio fallisce. Non lancia mai:
 * gli errori finiscono nei log.
 */
export async function requestPaVerification(payload: PaVerificationRequest): Promise<void> {
	if (!isOscarEnabled()) return;
	const url = process.env.OSCAR_URL;
	const key = oscarKey();
	if (!url || !key) {
		logger.error("Oscar PA verification enabled but OSCAR_URL or OSCAR_KEY is missing");
		return;
	}
	try {
		await db.setPaVerified(payload.userId, PA_VERIFIED.PENDING);
		const res = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${signOscarRequestToken(key)}`,
			},
			body: JSON.stringify(payload),
			signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
		});
		if (!res.ok) throw new Error(`Oscar responded ${res.status}`);
		logger.info("Oscar PA verification requested", { userId: payload.userId, pa: payload.pa.code });
	} catch (err) {
		logger.error("Oscar PA verification request failed", err instanceof Error ? err : undefined, {
			userId: payload.userId,
		});
		await db.clearPendingPaVerification(payload.userId).catch(() => {});
	}
}
