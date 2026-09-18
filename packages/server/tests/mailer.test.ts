import { afterEach, describe, expect, mock, test } from "bun:test";

// ─── Mocks ────────────────────────────────────────────────────────────────────

mock.module("../lib/logger", () => ({
	logger: { debug: mock(() => { }), info: mock(() => { }), warn: mock(() => { }), error: mock(() => { }) },
	httpLogger: mock(async (_c: unknown, next: () => Promise<void>) => next()),
	logStartup: mock(() => { }),
}));

/** Captures what each provider was asked to send, without touching the network. */
const resendCalls: unknown[] = [];
const smtpCalls: unknown[] = [];

mock.module("../lib/mailer-resend", () => ({
	sendMailResend: mock(async (args: unknown) => {
		resendCalls.push(args);
		return { id: "resend-id", error: null };
	}),
}));

mock.module("../lib/mailer-smtp", () => ({
	sendMailSmtp: mock(async (args: unknown) => {
		smtpCalls.push(args);
		return { id: "smtp-id", error: null };
	}),
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

const ARGS = {
	to: ["mario.rossi@example.com"],
	subject: "Activate Your Account",
	html: "<p>hi</p>",
	from: "Graph Italia <no-reply@example.com>",
};

afterEach(() => {
	delete process.env["MAIL_PROVIDER"];
	resendCalls.length = 0;
	smtpCalls.length = 0;
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("provider selection", () => {
	test("defaults to resend when MAIL_PROVIDER is unset", async () => {
		const { getMailProvider, sendMail } = await import("../lib/mailer");
		expect(getMailProvider()).toBe("resend");

		const result = await sendMail(ARGS);
		expect(result.id).toBe("resend-id");
		expect(resendCalls).toHaveLength(1);
		expect(smtpCalls).toHaveLength(0);
	});

	test("MAIL_PROVIDER=smtp routes to the SMTP transport", async () => {
		process.env["MAIL_PROVIDER"] = "smtp";
		const { getMailProvider, sendMail } = await import("../lib/mailer");
		expect(getMailProvider()).toBe("smtp");

		const result = await sendMail(ARGS);
		expect(result.id).toBe("smtp-id");
		expect(smtpCalls).toHaveLength(1);
		expect(resendCalls).toHaveLength(0);
	});

	test("an unknown provider falls back to resend rather than failing to send", async () => {
		process.env["MAIL_PROVIDER"] = "carrier-pigeon";
		const { getMailProvider, sendMail } = await import("../lib/mailer");
		expect(getMailProvider()).toBe("resend");

		await sendMail(ARGS);
		expect(resendCalls).toHaveLength(1);
	});

	test("the provider is resolved per call, not captured at import", async () => {
		const { sendMail } = await import("../lib/mailer");
		await sendMail(ARGS);
		process.env["MAIL_PROVIDER"] = "smtp";
		await sendMail(ARGS);

		expect(resendCalls).toHaveLength(1);
		expect(smtpCalls).toHaveLength(1);
	});
});

describe("maskEmail", () => {
	test("keeps two characters and the domain", async () => {
		const { maskEmail } = await import("../lib/mailer");
		expect(maskEmail("mario.rossi@example.com")).toBe("ma***@example.com");
	});
});

// NOTE: no test here for lib/email.ts itself. auth.test.ts and orgs.test.ts
// replace that module with mock.module("../lib/email", ...), which bun applies
// process-wide, so any assertion on the real templates would pass alone and
// fail in the full run depending on file order. The transport contract is what
// this change introduces, and it is covered above.
