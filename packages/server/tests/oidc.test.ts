import { afterAll, beforeAll, beforeEach, describe, expect, mock, test } from "bun:test";
import { Hono } from "hono";

// ─── Constants ────────────────────────────────────────────────────────────────

const JWT_SECRET = "test-secret";
process.env["JWT_SECRET"] = JWT_SECRET;
process.env["APP_URL"] = "http://localhost:3000";

const LINKED_SUB = "sub-linked"; // already linked to LINKED_USER
const NEW_SUB = "sub-new"; // not linked to anything
const LINKED_EMAIL = "linked@test.com";
const PASSWORD_EMAIL = "password-user@test.com"; // email/password account, no identity yet
const FREE_EMAIL = "new@test.com"; // no account
const STRONG_PASSWORD = "P@ssw0rd1!";
const PIN = "123456";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const LINKED_USER = {
	id: "user-1",
	email: LINKED_EMAIL,
	password: "hashed",
	verified: true,
	role: "USER",
	createdAt: new Date(),
	updatedAt: new Date(),
};
const PASSWORD_USER = { ...LINKED_USER, id: "user-2", email: PASSWORD_EMAIL, verified: false };
const CREATED_USER = { ...LINKED_USER, id: "user-3", email: FREE_EMAIL };

// The OIDC session getAuth() returns; mutated per-test.
let currentAuth: Record<string, unknown> | null = null;

// ─── Mocks ────────────────────────────────────────────────────────────────────

const loggerStub = {
	debug: mock(() => {}),
	info: mock(() => {}),
	warn: mock(() => {}),
	error: mock(() => {}),
};
mock.module("../lib/logger", () => ({
	default: loggerStub, // oidc.ts imports the logger as default
	logger: loggerStub,
	httpLogger: mock(async (_c: unknown, next: () => Promise<void>) => next()),
	logStartup: mock(() => {}),
}));

// Runtime stub for @hono/oidc-auth: getAuth returns the per-test session, the
// middleware is a passthrough (no provider redirect in tests).
mock.module("@hono/oidc-auth", () => ({
	getAuth: mock(async () => currentAuth),
	oidcAuthMiddleware: mock(() => async (_c: unknown, next: () => Promise<void>) => next()),
	processOAuthCallback: mock(async (c: { redirect: (u: string) => unknown }) => c.redirect("/")),
	revokeSession: mock(async () => {}),
}));

const sendOidcEmailCode = mock(async (_email: string, _pin: string) => ({}));
mock.module("../lib/email", () => ({ sendOidcEmailCode }));
mock.module("../lib/pin", () => ({ default: () => PIN }));

const linkOidcIdentity = mock(async (_userId: string, _sub: string) => ({}));
const createUserMock = mock(async (_args: Record<string, unknown>) => CREATED_USER);
const setVerified = mock(async (id: string) => ({ ...(id === PASSWORD_USER.id ? PASSWORD_USER : CREATED_USER), verified: true }));

mock.module("../lib/db", () => ({
	default: {
		findUserByOidcSub: mock(async (sub: string) => (sub === LINKED_SUB ? LINKED_USER : null)),
		findUserByEmailInsensitive: mock(async (email: string) => {
			const e = email.toLowerCase();
			if (e === LINKED_EMAIL) return LINKED_USER;
			if (e === PASSWORD_EMAIL) return PASSWORD_USER;
			return null;
		}),
		linkOidcIdentity,
		createUserByEmailAndPassword: createUserMock,
		setVerified,
	},
}));

// ─── App builder ─────────────────────────────────────────────────────────────

async function buildApp() {
	const { default: oidcRouter } = await import("../routes/oidc");
	const app = new Hono();
	app.route("/oidc", oidcRouter);
	return app;
}

function withJson(body: object, cookie?: string) {
	return {
		method: "POST",
		headers: { "Content-Type": "application/json", ...(cookie ? { Cookie: cookie } : {}) },
		body: JSON.stringify(body),
	};
}

// The `oidc-email` cookie a response sets, as a request Cookie header.
function emailCookie(res: Response) {
	const raw = res.headers.getSetCookie().find((c) => c.startsWith("oidc-email="));
	return raw?.split(";")[0];
}

// Runs the send-code step for the current session and returns the pending cookie.
async function sendCode(email: string) {
	const res = await app.request("/oidc/signup/email/send", withJson({ email }));
	expect(res.status).toBe(200);
	return emailCookie(res)!;
}

let app: Hono;
beforeAll(async () => { app = await buildApp(); });
beforeEach(() => {
	linkOidcIdentity.mockClear();
	createUserMock.mockClear();
	sendOidcEmailCode.mockClear();
	setVerified.mockClear();
});

// ─── /oidc/login ───────────────────────────────────────────────────────────────

describe("GET /oidc/login", () => {
	test("linked sub, no email from IdP → 302 to APP_URL, sets access_token cookie", async () => {
		currentAuth = { sub: LINKED_SUB };
		const res = await app.request("/oidc/login");
		expect(res.status).toBe(302);
		expect(res.headers.get("location")).toBe("http://localhost:3000");
		expect(res.headers.get("set-cookie")).toContain("access_token");
	});

	test("IdP email matching a password account → links the new sub, activates and logs in", async () => {
		currentAuth = { sub: NEW_SUB, email: "Password-User@Test.com" };
		const res = await app.request("/oidc/login");
		expect(res.status).toBe(302);
		expect(res.headers.get("location")).toBe("http://localhost:3000");
		expect(res.headers.get("set-cookie")).toContain("access_token");
		expect(linkOidcIdentity).toHaveBeenCalledWith(PASSWORD_USER.id, NEW_SUB);
		expect(setVerified).toHaveBeenCalledWith(PASSWORD_USER.id);
	});

	test("IdP email with no account, unknown sub → 302 to signup, no session cookie", async () => {
		currentAuth = { sub: NEW_SUB, email: FREE_EMAIL };
		const res = await app.request("/oidc/login");
		expect(res.status).toBe(302);
		expect(res.headers.get("location")).toBe("http://localhost:3000/oidc/signup?t=sub-new");
		expect(res.headers.get("set-cookie") ?? "").not.toContain("access_token");
	});

	test("no email from IdP, unknown sub → 302 to signup", async () => {
		currentAuth = { sub: NEW_SUB };
		const res = await app.request("/oidc/login");
		expect(res.status).toBe(302);
		expect(res.headers.get("location")).toBe("http://localhost:3000/oidc/signup?t=sub-new");
	});

	test("no sub in session → 401", async () => {
		currentAuth = { email: FREE_EMAIL };
		const res = await app.request("/oidc/login");
		expect(res.status).toBe(401);
	});
});

// ─── /oidc/signup/status ─────────────────────────────────────────────────────

describe("GET /oidc/signup/status", () => {
	test("email from IdP → verified, prefilled", async () => {
		currentAuth = { sub: NEW_SUB, email: FREE_EMAIL, given_name: "Ada", family_name: "Lovelace" };
		const res = await app.request("/oidc/signup/status");
		expect(res.status).toBe(200);
		const body = (await res.json()) as Record<string, unknown>;
		expect(body).toMatchObject({ registered: false, email: FREE_EMAIL, emailFromIdp: true, emailVerified: true, given_name: "Ada" });
	});

	test("no email from IdP → must be asked and verified", async () => {
		currentAuth = { sub: NEW_SUB };
		const res = await app.request("/oidc/signup/status");
		const body = (await res.json()) as Record<string, unknown>;
		expect(body).toMatchObject({ registered: false, email: "", emailFromIdp: false, emailVerified: false });
	});

	test("linked sub → registered", async () => {
		currentAuth = { sub: LINKED_SUB };
		const res = await app.request("/oidc/signup/status");
		const body = (await res.json()) as Record<string, unknown>;
		expect(body.registered).toBe(true);
	});

	test("no OIDC session → 401", async () => {
		currentAuth = null;
		const res = await app.request("/oidc/signup/status");
		expect(res.status).toBe(401);
	});
});

// ─── /oidc/signup/email/* ────────────────────────────────────────────────────

describe("email verification (no email from IdP)", () => {
	test("send → mails the code and sets the pending cookie", async () => {
		currentAuth = { sub: NEW_SUB };
		const cookie = await sendCode(FREE_EMAIL);
		expect(cookie).toBeDefined();
		expect(sendOidcEmailCode).toHaveBeenCalledWith(FREE_EMAIL, PIN);
	});

	test("send refused when the IdP already provides the email → 400", async () => {
		currentAuth = { sub: NEW_SUB, email: FREE_EMAIL };
		const res = await app.request("/oidc/signup/email/send", withJson({ email: FREE_EMAIL }));
		expect(res.status).toBe(400);
	});

	test("send with an invalid email → 400", async () => {
		currentAuth = { sub: NEW_SUB };
		const res = await app.request("/oidc/signup/email/send", withJson({ email: "nope" }));
		expect(res.status).toBe(400);
	});

	test("verify with a wrong code → 400", async () => {
		currentAuth = { sub: NEW_SUB };
		const cookie = await sendCode(FREE_EMAIL);
		const res = await app.request("/oidc/signup/email/verify", withJson({ code: "000000" }, cookie));
		expect(res.status).toBe(400);
	});

	test("verify without the pending cookie → 400", async () => {
		currentAuth = { sub: NEW_SUB };
		const res = await app.request("/oidc/signup/email/verify", withJson({ code: PIN }));
		expect(res.status).toBe(400);
	});

	test("pending cookie bound to another sub → 400", async () => {
		currentAuth = { sub: "sub-other" };
		const cookie = await sendCode(FREE_EMAIL);
		currentAuth = { sub: NEW_SUB };
		const res = await app.request("/oidc/signup/email/verify", withJson({ code: PIN }, cookie));
		expect(res.status).toBe(400);
	});

	test("verified email of an existing account → links sub and logs in", async () => {
		currentAuth = { sub: NEW_SUB };
		const cookie = await sendCode(PASSWORD_EMAIL);
		const res = await app.request("/oidc/signup/email/verify", withJson({ code: PIN }, cookie));
		expect(res.status).toBe(200);
		expect(await res.json()).toMatchObject({ auth: true });
		expect(res.headers.get("set-cookie")).toContain("access_token");
		expect(linkOidcIdentity).toHaveBeenCalledWith(PASSWORD_USER.id, NEW_SUB);
	});

	test("verified new email → { auth:false }, then signup creates the account with it", async () => {
		currentAuth = { sub: NEW_SUB };
		const pending = await sendCode(FREE_EMAIL);
		const verifyRes = await app.request("/oidc/signup/email/verify", withJson({ code: PIN }, pending));
		expect(verifyRes.status).toBe(200);
		expect(await verifyRes.json()).toMatchObject({ auth: false, email: FREE_EMAIL });
		const verified = emailCookie(verifyRes)!;

		const statusRes = await app.request("/oidc/signup/status", { headers: { Cookie: verified } });
		expect(await statusRes.json()).toMatchObject({ email: FREE_EMAIL, emailVerified: true });

		const res = await app.request("/oidc/signup", withJson({ pa: "Comune", password: STRONG_PASSWORD }, verified));
		expect(res.status).toBe(200);
		expect(createUserMock.mock.calls[0]![0]).toMatchObject({ email: FREE_EMAIL, sub: NEW_SUB, pa: "Comune" });
	});
});

// ─── /oidc/signup ────────────────────────────────────────────────────────────

describe("POST /oidc/signup", () => {
	test("email from IdP + password → 200, account created with the IdP email", async () => {
		currentAuth = { sub: NEW_SUB, email: FREE_EMAIL };
		// A body email is ignored: the address comes from the IdP or the verification.
		const res = await app.request("/oidc/signup", withJson({ email: "other@test.com", password: STRONG_PASSWORD }));
		expect(res.status).toBe(200);
		expect(await res.json()).toMatchObject({ auth: true });
		expect(res.headers.get("set-cookie")).toContain("access_token");
		expect(createUserMock.mock.calls[0]![0]).toMatchObject({ email: FREE_EMAIL, sub: NEW_SUB });
	});

	test("no email from IdP and none verified → 400", async () => {
		currentAuth = { sub: NEW_SUB };
		const res = await app.request("/oidc/signup", withJson({ email: FREE_EMAIL, password: STRONG_PASSWORD }));
		expect(res.status).toBe(400);
		expect(createUserMock).not.toHaveBeenCalled();
	});

	test("a pending (not yet verified) code is not enough → 400", async () => {
		currentAuth = { sub: NEW_SUB };
		const pending = await sendCode(FREE_EMAIL);
		const res = await app.request("/oidc/signup", withJson({ password: STRONG_PASSWORD }, pending));
		expect(res.status).toBe(400);
	});

	test("missing password while password auth is on → 400", async () => {
		currentAuth = { sub: NEW_SUB, email: FREE_EMAIL };
		const res = await app.request("/oidc/signup", withJson({}));
		expect(res.status).toBe(400);
	});

	test("already registered (double submit) → 200 { auth:true }, nothing created", async () => {
		currentAuth = { sub: LINKED_SUB };
		const res = await app.request("/oidc/signup", withJson({}));
		expect(res.status).toBe(200);
		expect(await res.json()).toMatchObject({ auth: true });
		expect(createUserMock).not.toHaveBeenCalled();
	});

	test("no OIDC session → 401", async () => {
		currentAuth = null;
		const res = await app.request("/oidc/signup", withJson({ password: STRONG_PASSWORD }));
		expect(res.status).toBe(401);
	});
});

describe("POST /oidc/signup with ENABLE_PASSWORD_AUTH=false", () => {
	beforeAll(() => { process.env["ENABLE_PASSWORD_AUTH"] = "false"; });
	afterAll(() => { delete process.env["ENABLE_PASSWORD_AUTH"]; });

	test("no password needed; account created without one even if sent", async () => {
		currentAuth = { sub: NEW_SUB, email: FREE_EMAIL };
		const res = await app.request("/oidc/signup", withJson({ pa: "Comune", password: STRONG_PASSWORD }));
		expect(res.status).toBe(200);
		expect(res.headers.get("set-cookie")).toContain("access_token");
		expect(createUserMock).toHaveBeenCalledTimes(1);
		expect(createUserMock.mock.calls[0]![0].password).toBeUndefined();
	});
});
