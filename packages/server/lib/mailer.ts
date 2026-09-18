import { logger } from "./logger";
import { sendMailResend } from "./mailer-resend";
import { sendMailSmtp } from "./mailer-smtp";

/**
 * Mail transport selection.
 *
 * Two providers live side by side: `resend` (the original, still the default)
 * and `smtp` (nodemailer against any SMTP connector — Mailgun included, once
 * its credentials arrive). MAIL_PROVIDER picks one at runtime, so switching is
 * a restart and not a deploy of new code, and going back is just as cheap.
 *
 * Both implement the same contract below. `lib/email.ts` owns the templates and
 * never knows which one is in use.
 */
export type MailProvider = "resend" | "smtp";

export type SendMailResult = {
	/** Provider-side message id, when the provider returns one. */
	id?: string | null;
	error?: { name: string; message: string } | null;
};

export type SendMailArgs = {
	to: string[];
	subject: string;
	html: string;
	/** `Name <address>` — built by the caller so both providers send the same From. */
	from: string;
};

export function getMailProvider(): MailProvider {
	const configured = (process.env.MAIL_PROVIDER || "resend").trim().toLowerCase();
	if (configured === "smtp" || configured === "resend") return configured;
	logger.warn("Unknown MAIL_PROVIDER, falling back to resend", { configured });
	return "resend";
}

/** Masks an address for logs: `ma***@example.com`. */
export function maskEmail(address: string): string {
	return address.replace(/(.{2}).*@/, "$1***@");
}

export function sendMail(args: SendMailArgs): Promise<SendMailResult> {
	return getMailProvider() === "smtp" ? sendMailSmtp(args) : sendMailResend(args);
}
