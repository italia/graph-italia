import nodemailer, { type Transporter } from "nodemailer";
import { logger } from "./logger";
import { maskEmail, type SendMailArgs, type SendMailResult } from "./mailer";

const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASSWORD = process.env.SMTP_PASSWORD || "";
// Implicit TLS (port 465). On 587 the connection starts in clear and is
// upgraded with STARTTLS, which nodemailer does on its own.
const SMTP_SECURE = process.env.SMTP_SECURE === "true" || SMTP_PORT === 465;

let transporter: Transporter | null = null;

/**
 * Built lazily so that importing this module never opens a connection — tests
 * and local dev without SMTP configured must not pay for it. Returns null when
 * the connector is not configured, which the caller reports like a missing API
 * key rather than by throwing.
 */
function getTransporter(): Transporter | null {
	if (!SMTP_HOST) return null;
	if (!transporter) {
		transporter = nodemailer.createTransport({
			host: SMTP_HOST,
			port: SMTP_PORT,
			secure: SMTP_SECURE,
			// Anonymous relays (an internal MTA, MailHog in dev) take no credentials.
			auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASSWORD } : undefined,
		});
	}
	return transporter;
}

/**
 * SMTP transport — nodemailer against any SMTP connector. Mailgun, Amazon SES
 * and a plain corporate relay all speak it, so this is the path that outlives
 * any single provider.
 */
export async function sendMailSmtp({ to, subject, html, from }: SendMailArgs): Promise<SendMailResult> {
	const startTime = performance.now();
	const mailer = getTransporter();

	if (!mailer) {
		logger.warn("Email send skipped: SMTP_HOST not configured", {
			email: { to: to.map(maskEmail), subject },
		});
		return { id: null, error: { name: "NoSmtpHost", message: "SMTP_HOST not configured" } };
	}

	try {
		const result = await mailer.sendMail({
			from,
			to: to.join(", "),
			subject,
			html,
			headers: {
				"X-Entity-Ref-ID": `graph-italia-${Date.now()}`, // Prevents threading in Gmail
			},
		});

		const duration = Math.round(performance.now() - startTime);

		// A recipient the server refused is not an exception: nodemailer reports
		// it in `rejected` with an otherwise successful send.
		if (result.rejected?.length) {
			const rejected = result.rejected.map((r) => maskEmail(String(r)));
			logger.error("Email send failed", undefined, {
				email: { to: to.map(maskEmail), subject, provider: "smtp" },
				error: { code: "Rejected", message: `Recipients rejected: ${rejected.join(", ")}` },
				duration_ms: duration,
			});
			return { id: result.messageId ?? null, error: { name: "Rejected", message: `Recipients rejected: ${rejected.join(", ")}` } };
		}

		logger.info("Email sent successfully", {
			email: { id: result.messageId, to: to.map(maskEmail), subject, provider: "smtp" },
			duration_ms: duration,
		});

		return { id: result.messageId ?? null, error: null };
	} catch (error) {
		const duration = Math.round(performance.now() - startTime);
		logger.error("Email send exception", error instanceof Error ? error : undefined, {
			email: { to: to.map(maskEmail), subject, provider: "smtp" },
			duration_ms: duration,
		});
		throw error;
	}
}
