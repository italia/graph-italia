import { Resend } from "resend";
import { logger } from "./logger";
import { maskEmail, type SendMailArgs, type SendMailResult } from "./mailer";

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
// The Resend SDK throws synchronously on construction when the key is empty.
// In tests (and any local dev without email configured) we want imports of
// this module to succeed without crashing; the actual send call below will
// surface a clear error if the client is missing.
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

/** Resend transport — the original provider, kept as the default. */
export async function sendMailResend({ to, subject, html, from }: SendMailArgs): Promise<SendMailResult> {
	const startTime = performance.now();

	if (!resend) {
		logger.warn("Email send skipped: RESEND_API_KEY not configured", {
			email: { to: to.map(maskEmail), subject },
		});
		return { id: null, error: { name: "NoApiKey", message: "RESEND_API_KEY not configured" } };
	}

	try {
		const result = await resend.emails.send({
			from,
			to,
			subject,
			html,
			headers: {
				"X-Entity-Ref-ID": `graph-italia-${Date.now()}`, // Prevents threading in Gmail
			},
		});

		const duration = Math.round(performance.now() - startTime);

		if (result.error) {
			logger.error("Email send failed", undefined, {
				email: { to: to.map(maskEmail), subject, provider: "resend" },
				error: { code: result.error.name, message: result.error.message },
				duration_ms: duration,
			});
			return { id: null, error: { name: result.error.name, message: result.error.message } };
		}

		logger.info("Email sent successfully", {
			email: { id: result.data?.id, to: to.map(maskEmail), subject, provider: "resend" },
			duration_ms: duration,
		});

		return { id: result.data?.id ?? null, error: null };
	} catch (error) {
		const duration = Math.round(performance.now() - startTime);
		logger.error("Email send exception", error instanceof Error ? error : undefined, {
			email: { to: to.map(maskEmail), subject, provider: "resend" },
			duration_ms: duration,
		});
		throw error;
	}
}
