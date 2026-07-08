import { beforeAll, describe, expect, mock, test } from "bun:test";
import { Hono } from "hono";

// ─── Constants ────────────────────────────────────────────────────────────────

const JWT_SECRET = "test-secret";
process.env["JWT_SECRET"] = JWT_SECRET;
process.env["APP_URL"] = "http://localhost:3000";

const EXISTING_SUB = "sub-existing"; // has an account linked
const NEW_SUB = "sub-new"; // no account yet → must sign up
const EXISTING_EMAIL = "taken@test.com"; // belongs to another account (no sub)
const FREE_EMAIL = "new@test.com";
const STRONG_PASSWORD = "P@ssw0rd1!";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const DB_USER = {
	id: "user-1",
	email: "linked@test.com",
	sub: EXISTING_SUB,
	password: "hashed",
	verified: true,
	role: "USER",
	createdAt: new Date(),
	updatedAt: new Date(),
};

const OTHER_USER = { ...DB_USER, id: "user-2", email: EXISTING_EMAIL, sub: null };
const CREATED_USER = { ...DB_USER, id: "user-3", email: FREE_EMAIL, sub: NEW_SUB };

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

mock.module("../lib/db", () => ({
	default: {
		findUserBySub: mock(async (sub: string) => (sub === EXISTING_SUB ? DB_USER : null)),
		findUserByEmail: mock(async (email: string) => (email === EXISTING_EMAIL ? OTHER_USER : null)),
		createUserByEmailAndPassword: mock(async () => CREATED_USER),
		setVerified: mock(async () => CREATED_USER),
	},
}));

// ─── App builder ─────────────────────────────────────────────────────────────

async function buildApp() {
	const { default: oidcRouter } = await import("../routes/oidc");
	const app = new Hono();
	app.route("/oidc", oidcRouter);
	return app;
}

function withJson(body: object) {
	return {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	};
}

let app: Hono;
beforeAll(async () => { app = await buildApp(); });

// ─── /oidc/login ───────────────────────────────────────────────────────────────

describe("GET /oidc/login", () => {
	test("known sub → 302 to APP_URL, sets access_token cookie", async () => {
		currentAuth = { sub: EXISTING_SUB, email: DB_USER.email };
		const res = await app.request("/oidc/login");
		expect(res.status).toBe(302);
		expect(res.headers.get("location")).toBe("http://localhost:3000");
		expect(res.headers.get("set-cookie")).toContain("access_token");
	});

	test("unknown sub → 302 to /oidc/signup?t=<sub>, no session cookie", async () => {
		currentAuth = { sub: NEW_SUB, email: FREE_EMAIL };
		const res = await app.request("/oidc/login");
		expect(res.status).toBe(302);
		expect(res.headers.get("location")).toBe(
			"http://localhost:3000/oidc/signup?t=sub-new",
		);
		expect(res.headers.get("set-cookie") ?? "").not.toContain("access_token");
	});

	test("no sub in session → 401", async () => {
		currentAuth = { email: FREE_EMAIL }; // sub missing
		const res = await app.request("/oidc/login");
		expect(res.status).toBe(401);
	});
});

// ─── /oidc/signup/status ─────────────────────────────────────────────────────

describe("GET /oidc/signup/status", () => {
	test("unregistered sub → 200 { registered:false } with claims", async () => {
		currentAuth = { sub: NEW_SUB, email: FREE_EMAIL, given_name: "Ada", family_name: "Lovelace" };
		const res = await app.request("/oidc/signup/status");
		expect(res.status).toBe(200);
		const body = (await res.json()) as Record<string, unknown>;
		expect(body.registered).toBe(false);
		expect(body.email).toBe(FREE_EMAIL);
		expect(body.given_name).toBe("Ada");
	});

	test("already-registered sub → 200 { registered:true }", async () => {
		currentAuth = { sub: EXISTING_SUB, email: DB_USER.email };
		const res = await app.request("/oidc/signup/status");
		expect(res.status).toBe(200);
		const body = (await res.json()) as Record<string, unknown>;
		expect(body.registered).toBe(true);
	});

	test("no OIDC session → 401", async () => {
		currentAuth = null;
		const res = await app.request("/oidc/signup/status");
		expect(res.status).toBe(401);
	});
});

// ─── /oidc/signup ────────────────────────────────────────────────────────────

describe("POST /oidc/signup", () => {
	test("new sub + free email + strong password → 200 { auth:true }, sets cookie", async () => {
		currentAuth = { sub: NEW_SUB, email: FREE_EMAIL };
		const res = await app.request("/oidc/signup", withJson({ email: FREE_EMAIL, password: STRONG_PASSWORD }));
		expect(res.status).toBe(200);
		const body = (await res.json()) as Record<string, unknown>;
		expect(body.auth).toBe(true);
		expect(res.headers.get("set-cookie")).toContain("access_token");
	});

	test("email already in use by another account → 409", async () => {
		currentAuth = { sub: NEW_SUB, email: FREE_EMAIL };
		const res = await app.request("/oidc/signup", withJson({ email: EXISTING_EMAIL, password: STRONG_PASSWORD }));
		expect(res.status).toBe(409);
	});

	test("missing email/password → 400", async () => {
		currentAuth = { sub: NEW_SUB, email: FREE_EMAIL };
		const res = await app.request("/oidc/signup", withJson({ email: FREE_EMAIL }));
		expect(res.status).toBe(400);
	});

	test("sub already registered (double submit) → 200 { auth:true } without touching email", async () => {
		currentAuth = { sub: EXISTING_SUB, email: DB_USER.email };
		const res = await app.request("/oidc/signup", withJson({}));
		expect(res.status).toBe(200);
		const body = (await res.json()) as Record<string, unknown>;
		expect(body.auth).toBe(true);
	});

	test("no OIDC session → 401", async () => {
		currentAuth = null;
		const res = await app.request("/oidc/signup", withJson({ email: FREE_EMAIL, password: STRONG_PASSWORD }));
		expect(res.status).toBe(401);
	});
});
