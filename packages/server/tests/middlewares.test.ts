import { beforeAll, describe, expect, mock, test } from "bun:test";
import { Hono } from "hono";
import { sign } from "jsonwebtoken";
import type { IAccessTokenPayload } from "../lib/jwt";
import type { ApiKeyModel } from "../lib/db/prisma/models/ApiKey";

type TestVariables = {
	user: IAccessTokenPayload | null;
	token: string | undefined;
	apiKey: ApiKeyModel | null;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const JWT_SECRET = "test-secret";
process.env["JWT_SECRET"] = JWT_SECRET;

const READONLY_KEY  = `dv_aaaaaaaa_${"a".repeat(64)}`;
const READWRITE_KEY = `dv_bbbbbbbb_${"b".repeat(64)}`;
const EXPIRED_KEY   = `dv_cccccccc_${"c".repeat(64)}`;
const REVOKED_KEY   = `dv_dddddddd_${"d".repeat(64)}`;
const UNKNOWN_KEY   = `dv_eeeeeeee_${"e".repeat(64)}`;

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

mock.module("../lib/db/apiKeyDb", () => ({
	findApiKeyByRawKey: mock(async (key: string) => {
		if (key === READONLY_KEY) {
			return {
				id: "key-readonly",
				prefix: "aaaaaaaa",
				keyHash: "hash_readonly",
				role: "READONLY",
				expire: 60,
				revokedAt: null,
				project: null,
				projectId: "proj-1",
				createdAt: new Date(),
				updatedAt: new Date(),
			};
		}
		if (key === READWRITE_KEY) {
			return {
				id: "key-readwrite",
				prefix: "bbbbbbbb",
				keyHash: "hash_readwrite",
				role: "READWRITE",
				expire: 60,
				revokedAt: null,
				project: null,
				projectId: "proj-1",
				createdAt: new Date(),
				updatedAt: new Date(),
			};
		}
		if (key === EXPIRED_KEY) {
			return {
				id: "key-expired",
				prefix: "cccccccc",
				keyHash: "hash_expired",
				role: "READONLY",
				expire: 1,
				// 2 days ago → expired
				revokedAt: null,
				project: null,
				projectId: "proj-1",
				createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
				updatedAt: new Date(),
			};
		}
		if (key === REVOKED_KEY) {
			return {
				id: "key-revoked",
				prefix: "dddddddd",
				keyHash: "hash_revoked",
				role: "READONLY",
				expire: 60,
				revokedAt: new Date(),
				project: null,
				projectId: "proj-1",
				createdAt: new Date(),
				updatedAt: new Date(),
			};
		}
		return null;
	}),
	revokeApiKey:    mock(async () => undefined),
	reinstateApiKey: mock(async () => undefined),
	createApiLog:    mock(async () => undefined),
}));

// ─── Test App ─────────────────────────────────────────────────────────────────

// Build a minimal Hono app that replicates the auth middleware chain
// without pulling in the full server (DB connections, etc.)
async function buildTestApp() {
	const { checkAuth, requireUser, requireApiKey, requireApiKeyRole } = await import("../lib/middlewares");

	const app = new Hono<{ Variables: TestVariables }>();
	app.use("*", checkAuth);

	// Public endpoint — no extra auth
	app.get("/public", (c) => c.json({ ok: true }));

	// Requires a logged-in user (JWT / cookie)
	app.get("/protected/user", requireUser, (c) => {
		const user = c.get("user");
		return c.json({ userId: user?.userId });
	});

	// Requires any valid API key
	app.get("/protected/apikey", requireApiKey, (c) => {
		const apiKey = c.get("apiKey");
		return c.json({ projectId: apiKey?.projectId, role: apiKey?.role });
	});

	// Requires READWRITE API key
	app.post("/protected/apikey/write", requireApiKeyRole("READWRITE"), (c) => {
		const apiKey = c.get("apiKey");
		return c.json({ projectId: apiKey?.projectId });
	});

	return app;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeJwt(userId = "user-1") {
	return sign({ userId, name: "test@example.com" }, JWT_SECRET, { expiresIn: "1h" });
}

let app: Hono<{ Variables: TestVariables }>;

beforeAll(async () => {
	app = await buildTestApp();
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("Auth middleware — no credentials", () => {
	test("public endpoint is accessible without any auth", async () => {
		const res = await app.request("/public");
		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({ ok: true });
	});

	test("protected user endpoint returns 401 with no credentials", async () => {
		const res = await app.request("/protected/user");
		expect(res.status).toBe(401);
	});

	test("protected apikey endpoint returns 401 with no credentials", async () => {
		const res = await app.request("/protected/apikey");
		expect(res.status).toBe(401);
	});
});

describe("Auth middleware — cookie (JWT)", () => {
	test("valid JWT cookie grants access to user endpoint", async () => {
		const token = makeJwt();
		const res = await app.request("/protected/user", {
			headers: { Cookie: `access_token=${token}` },
		});
		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body.userId).toBe("user-1");
	});

	test("invalid JWT cookie returns 401", async () => {
		const res = await app.request("/protected/user", {
			headers: { Cookie: "access_token=not.a.valid.jwt" },
		});
		expect(res.status).toBe(401);
	});

	test("JWT cookie does not satisfy apikey-only endpoint", async () => {
		const token = makeJwt();
		const res = await app.request("/protected/apikey", {
			headers: { Cookie: `access_token=${token}` },
		});
		// user is set but apiKey is not → requireApiKey rejects
		expect(res.status).toBe(401);
	});
});

describe("Auth middleware — Bearer JWT token", () => {
	test("valid JWT Bearer grants access to user endpoint", async () => {
		const token = makeJwt();
		const res = await app.request("/protected/user", {
			headers: { Authorization: `Bearer ${token}` },
		});
		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body.userId).toBe("user-1");
	});

	test("malformed Bearer JWT returns 401", async () => {
		const res = await app.request("/protected/user", {
			headers: { Authorization: "Bearer garbage" },
		});
		expect(res.status).toBe(401);
	});

	test("expired JWT returns 401", async () => {
		const expired = sign({ userId: "user-1", name: "test@example.com" }, JWT_SECRET, { expiresIn: "-1s" });
		const res = await app.request("/protected/user", {
			headers: { Authorization: `Bearer ${expired}` },
		});
		expect(res.status).toBe(401);
	});
});

describe("Auth middleware — API key Bearer", () => {
	test("READONLY key grants access to apikey endpoint", async () => {
		const res = await app.request("/protected/apikey", {
			headers: { Authorization: `Bearer ${READONLY_KEY}` },
		});
		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body.role).toBe("READONLY");
		expect(body.projectId).toBe("proj-1");
	});

	test("READWRITE key grants access to apikey endpoint", async () => {
		const res = await app.request("/protected/apikey", {
			headers: { Authorization: `Bearer ${READWRITE_KEY}` },
		});
		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body.role).toBe("READWRITE");
	});

	test("unknown API key returns 401", async () => {
		const res = await app.request("/protected/apikey", {
			headers: { Authorization: `Bearer ${UNKNOWN_KEY}` },
		});
		expect(res.status).toBe(401);
	});

	test("expired API key returns 401", async () => {
		const res = await app.request("/protected/apikey", {
			headers: { Authorization: `Bearer ${EXPIRED_KEY}` },
		});
		expect(res.status).toBe(401);
	});

	test("revoked API key returns 401", async () => {
		const res = await app.request("/protected/apikey", {
			headers: { Authorization: `Bearer ${REVOKED_KEY}` },
		});
		expect(res.status).toBe(401);
	});

	test("API key does not satisfy user-only endpoint", async () => {
		const res = await app.request("/protected/user", {
			headers: { Authorization: `Bearer ${READONLY_KEY}` },
		});
		// apiKey is set, user is null → requireUser rejects
		expect(res.status).toBe(401);
	});
});

describe("Auth middleware — API key role enforcement", () => {
	test("READWRITE key can access write endpoint", async () => {
		const res = await app.request("/protected/apikey/write", {
			method: "POST",
			headers: { Authorization: `Bearer ${READWRITE_KEY}` },
		});
		expect(res.status).toBe(200);
	});

	test("READONLY key is forbidden on write endpoint", async () => {
		const res = await app.request("/protected/apikey/write", {
			method: "POST",
			headers: { Authorization: `Bearer ${READONLY_KEY}` },
		});
		expect(res.status).toBe(403);
	});

	test("no API key is rejected on write endpoint", async () => {
		const res = await app.request("/protected/apikey/write", {
			method: "POST",
		});
		expect(res.status).toBe(401);
	});
});
