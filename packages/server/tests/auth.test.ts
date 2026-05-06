import { beforeAll, describe, expect, mock, test } from "bun:test";
import { Hono } from "hono";
import { sign } from "jsonwebtoken";
import type { IAccessTokenPayload } from "../lib/jwt";
import type { ApiKeyModel } from "../lib/db/prisma/models/ApiKey";

// ─── Types ────────────────────────────────────────────────────────────────────

type TestVariables = {
	user: IAccessTokenPayload | null;
	token: string | undefined;
	apiKey: ApiKeyModel | null;
	projectId: string | null;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const JWT_SECRET = "test-secret";
process.env["JWT_SECRET"] = JWT_SECRET;
process.env["APP_URL"] = "http://localhost:3000";

const USER_ID        = "user-verified";
const UNVERIFIED_ID  = "user-unverified";
const NO_CODE_ID     = "user-nocode";
const USER_EMAIL     = "verified@test.com";
const UNVERIFIED_EMAIL = "unverified@test.com";
const NEW_EMAIL      = "new@test.com"; // does not exist in DB
const CORRECT_PASSWORD = "P@ssw0rd1!";
const VALID_PIN      = "123456";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const DB_USER = {
	id: USER_ID,
	email: USER_EMAIL,
	password: "hashed:correct",
	verified: true,
	role: "USER",
	createdAt: new Date(),
	updatedAt: new Date(),
};

const DB_USER_UNVERIFIED = {
	...DB_USER,
	id: UNVERIFIED_ID,
	email: UNVERIFIED_EMAIL,
	verified: false,
};

const ACTIVATION_RECORD = {
	id: "code-act",
	code: VALID_PIN,
	type: "ACTIVATION",
	userId: USER_ID,
	consumedAt: null,
	expire: 60,
	createdAt: new Date(),
	updatedAt: new Date(),
};

const RECOVERY_RECORD = {
	id: "code-rec",
	code: VALID_PIN,
	type: "RECOVERY",
	userId: USER_ID,
	consumedAt: null,
	expire: 60,
	createdAt: new Date(),
	updatedAt: new Date(),
};

// ─── Mocks ────────────────────────────────────────────────────────────────────

mock.module("../lib/logger", () => ({
	logger: {
		debug: mock(() => {}),
		info: mock(() => {}),
		warn: mock(() => {}),
		error: mock(() => {}),
	},
	httpLogger: mock(async (_c: unknown, next: () => Promise<void>) => next()),
	logStartup: mock(() => {}),
}));

mock.module("../lib/email", () => ({
	sendActivationEmail: mock(async () => {}),
	sendResetPasswordEmail: mock(async () => {}),
}));

mock.module("bcrypt", () => ({
	compare: mock(async (plain: string, hash: string) =>
		plain === CORRECT_PASSWORD && hash === "hashed:correct",
	),
	hashSync: mock((_: string, __: number) => "hashed"),
}));

mock.module("../lib/db/apiKeyDb", () => ({
	findApiKeyByRawKey: mock(async () => null),
}));

mock.module("../lib/db", () => ({
	default: {
		findUserByEmail: mock(async (email: string) => {
			if (email === USER_EMAIL) return DB_USER;
			if (email === UNVERIFIED_EMAIL) return DB_USER_UNVERIFIED;
			return null;
		}),
		findUserById: mock(async (id: string) => {
			if (id === USER_ID) return DB_USER;
			if (id === UNVERIFIED_ID) return DB_USER_UNVERIFIED;
			return null;
		}),
		createUserByEmailAndPassword: mock(async () => DB_USER),
		createCode: mock(async () => VALID_PIN),
		findCodeByUid: mock(async (userId: string, type: string) => {
			if (userId === NO_CODE_ID) return null;
			if (type === "ACTIVATION") return ACTIVATION_RECORD;
			if (type === "RECOVERY") return RECOVERY_RECORD;
			return null;
		}),
		consumeCode: mock(async () => {}),
		setVerified: mock(async () => DB_USER),
		destroyCodes: mock(async () => {}),
		changePassword: mock(async () => {}),
		getDefaultProjectId: mock(async () => null),
	},
}));

// ─── App builder ─────────────────────────────────────────────────────────────

async function buildApp() {
	const { default: authRouter } = await import("../routes/auth");
	const { checkAuth } = await import("../lib/middlewares");
	const app = new Hono<{ Variables: TestVariables }>();
	app.use("*", checkAuth);
	app.route("/auth", authRouter);
	return app;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function userHeaders(userId = USER_ID) {
	const token = sign({ userId, name: USER_EMAIL }, JWT_SECRET, { expiresIn: "1h" });
	return { Authorization: `Bearer ${token}` };
}

function withJson(headers: Record<string, string>, body: object) {
	return {
		headers: { ...headers, "Content-Type": "application/json" },
		body: JSON.stringify(body),
	};
}

let app: Hono<{ Variables: TestVariables }>;
beforeAll(async () => { app = await buildApp(); });

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("POST /auth/register", () => {
	test("valid new email + strong password → 200, body has uid", async () => {
		const res = await app.request("/auth/register", {
			method: "POST",
			...withJson({}, { email: NEW_EMAIL, password: CORRECT_PASSWORD }),
		});
		expect(res.status).toBe(200);
		const body = await res.json() as Record<string, unknown>;
		expect(body.uid).toBeDefined();
	});

	test("existing email → 409", async () => {
		const res = await app.request("/auth/register", {
			method: "POST",
			...withJson({}, { email: USER_EMAIL, password: CORRECT_PASSWORD }),
		});
		expect(res.status).toBe(409);
	});

	test("missing password → 400 (zod validation)", async () => {
		const res = await app.request("/auth/register", {
			method: "POST",
			...withJson({}, { email: NEW_EMAIL }),
		});
		expect(res.status).toBe(400);
	});

	test("weak password (no uppercase) → 400", async () => {
		const res = await app.request("/auth/register", {
			method: "POST",
			...withJson({}, { email: NEW_EMAIL, password: "nouppercase1!" }),
		});
		expect(res.status).toBe(400);
	});
});

describe("POST /auth/login", () => {
	test("correct credentials, verified user → 200, { auth: true }, sets cookie", async () => {
		const res = await app.request("/auth/login", {
			method: "POST",
			...withJson({}, { email: USER_EMAIL, password: CORRECT_PASSWORD }),
		});
		expect(res.status).toBe(200);
		const body = await res.json() as Record<string, unknown>;
		expect(body.auth).toBe(true);
		const cookie = res.headers.get("set-cookie");
		expect(cookie).toContain("access_token");
	});

	test("correct credentials, unverified user → 401", async () => {
		const res = await app.request("/auth/login", {
			method: "POST",
			...withJson({}, { email: UNVERIFIED_EMAIL, password: CORRECT_PASSWORD }),
		});
		expect(res.status).toBe(401);
	});

	test("wrong password → 401", async () => {
		const res = await app.request("/auth/login", {
			method: "POST",
			...withJson({}, { email: USER_EMAIL, password: "WrongP@ss1!" }),
		});
		expect(res.status).toBe(401);
	});

	test("unknown email → 401", async () => {
		const res = await app.request("/auth/login", {
			method: "POST",
			...withJson({}, { email: NEW_EMAIL, password: CORRECT_PASSWORD }),
		});
		expect(res.status).toBe(401);
	});
});

describe("GET /auth/logout", () => {
	test("any request → 200, true", async () => {
		const res = await app.request("/auth/logout");
		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body).toBe(true);
	});
});

describe("POST /auth/recover", () => {
	test("known email → 200, true (sends email)", async () => {
		const res = await app.request("/auth/recover", {
			method: "POST",
			...withJson({}, { email: USER_EMAIL }),
		});
		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body).toBe(true);
	});

	test("unknown email → 200, true (silently ignored — no enumeration)", async () => {
		const res = await app.request("/auth/recover", {
			method: "POST",
			...withJson({}, { email: NEW_EMAIL }),
		});
		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body).toBe(true);
	});
});

describe("POST /auth/verify — activation", () => {
	test("valid uid + valid code → 200, { auth: true }", async () => {
		const res = await app.request("/auth/verify", {
			method: "POST",
			...withJson({}, { uid: USER_ID, code: VALID_PIN }),
		});
		expect(res.status).toBe(200);
		const body = await res.json() as Record<string, unknown>;
		expect(body.auth).toBe(true);
	});

	test("valid uid + wrong code → 400", async () => {
		const res = await app.request("/auth/verify", {
			method: "POST",
			...withJson({}, { uid: USER_ID, code: "999999" }),
		});
		expect(res.status).toBe(400);
	});

	test("valid uid + no code found → 400", async () => {
		const res = await app.request("/auth/verify", {
			method: "POST",
			...withJson({}, { uid: NO_CODE_ID, code: VALID_PIN }),
		});
		expect(res.status).toBe(400);
	});

	test("unknown uid → 400", async () => {
		const res = await app.request("/auth/verify", {
			method: "POST",
			...withJson({}, { uid: "nonexistent-user", code: VALID_PIN }),
		});
		expect(res.status).toBe(400);
	});
});

describe("GET /auth/confirm/:uid/:code — email link", () => {
	test("valid uid + valid code → 302 redirect", async () => {
		const res = await app.request(`/auth/confirm/${USER_ID}/${VALID_PIN}`);
		expect(res.status).toBe(302);
	});

	test("wrong code → 400", async () => {
		const res = await app.request(`/auth/confirm/${USER_ID}/wrong`);
		expect(res.status).toBe(400);
	});

	test("unknown uid → 400", async () => {
		const res = await app.request(`/auth/confirm/nonexistent-user/${VALID_PIN}`);
		expect(res.status).toBe(400);
	});
});

describe("POST /auth/reset-password", () => {
	test("valid uid + valid recovery code + valid password → 200, { auth: true }", async () => {
		const res = await app.request("/auth/reset-password", {
			method: "POST",
			...withJson({}, { uid: USER_ID, code: VALID_PIN, password: "NewP@ss1!" }),
		});
		expect(res.status).toBe(200);
		const body = await res.json() as Record<string, unknown>;
		expect(body.auth).toBe(true);
	});

	test("wrong code → 400", async () => {
		const res = await app.request("/auth/reset-password", {
			method: "POST",
			...withJson({}, { uid: USER_ID, code: "999999", password: "NewP@ss1!" }),
		});
		expect(res.status).toBe(400);
	});

	test("unknown uid → 400", async () => {
		const res = await app.request("/auth/reset-password", {
			method: "POST",
			...withJson({}, { uid: "nonexistent-user", code: VALID_PIN, password: "NewP@ss1!" }),
		});
		expect(res.status).toBe(400);
	});
});

describe("PUT /auth/pwd — change password (requires auth)", () => {
	test("authenticated user + valid password → 204", async () => {
		const res = await app.request("/auth/pwd", {
			method: "PUT",
			...withJson(userHeaders(), { password: "NewP@ss1!" }),
		});
		expect(res.status).toBe(204);
	});

	test("no credentials → 401", async () => {
		const res = await app.request("/auth/pwd", {
			method: "PUT",
			...withJson({}, { password: "NewP@ss1!" }),
		});
		expect(res.status).toBe(401);
	});
});
