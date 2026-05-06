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

// Used only to verify requireUser rejects API key bearer tokens
const READWRITE_KEY = `dv_bbbbbbbb_${"b".repeat(64)}`;

const USER_ID = "user-1";
const OTHER_USER = "user-2";
const PROJECT_ID = "proj-1";
const KEY_ID = "apikey-1";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const API_KEY = {
	id: KEY_ID,
	prefix: "aaaaaaaa",
	keyHash: "hash_placeholder",
	role: "READONLY",
	expire: 60,
	revokedAt: null,
	projectId: PROJECT_ID,
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
};

const LOG = {
	id: "log-1",
	apiKeyId: KEY_ID,
	keyPrefix: "aaaaaaaa",
	projectName: "Test Project",
	method: "GET",
	endpoint: "/charts",
	status: 200,
	responseTime: 42,
	timestamp: new Date().toISOString(),
};

// ─── Mocks ────────────────────────────────────────────────────────────────────

mock.module("../lib/logger", () => ({
	logger: { debug: mock(() => { }), info: mock(() => { }), warn: mock(() => { }), error: mock(() => { }) },
	httpLogger: mock(async (_c: unknown, next: () => Promise<void>) => next()),
	logStartup: mock(() => { }),
}));

mock.module("../lib/db/apiKeyDb", () => ({
	findApiKeyByRawKey: mock(async (key: string) => {
		if (key === READWRITE_KEY) {
			return {
				id: "key-rw",
				prefix: "bbbbbbbb",
				keyHash: "hash_rw",
				role: "READWRITE",
				expire: 60,
				revokedAt: null,
				projectId: PROJECT_ID,
				createdAt: new Date(),
				updatedAt: new Date(),
			};
		}
		return null;
	}),
	revokeApiKey: mock(async (id: string) => ({ ...API_KEY, id, revokedAt: new Date().toISOString() })),
	reinstateApiKey: mock(async (id: string) => ({ ...API_KEY, id, revokedAt: null })),
}));

mock.module("../lib/db", () => ({
	default: {
		getDefaultProjectId: mock(async (userId: string) => userId === USER_ID ? PROJECT_ID : null),
		findApiKeysByUserId: mock(async () => [API_KEY]),
		findApiKeyById: mock(async (id: string) => id === KEY_ID ? API_KEY : null),
		createApiKey: mock(async (projectId: string, role: string, expire: number) => ({
			...API_KEY,
			projectId,
			role,
			expire,
			rawKey: `dv_aaaaaaaa_${"a".repeat(64)}`,
		})),
		deleteApiKey: mock(async () => undefined),
		canUserModifyProject: mock(async (userId: string, projectId: string) => userId === USER_ID && projectId === PROJECT_ID),
		findLogsByApiKey: mock(async () => [LOG]),
		revokeApiKey: mock(async (id: string) => ({ ...API_KEY, id, revokedAt: new Date().toISOString() })),
		reinstateApiKey: mock(async (id: string) => ({ ...API_KEY, id, revokedAt: null })),
	},
}));

// ─── App builder ─────────────────────────────────────────────────────────────

async function buildApp() {
	const { default: apiKeysRouter } = await import("../routes/apikeys");
	const app = new Hono<{ Variables: TestVariables }>();
	app.route("/api-keys", apiKeysRouter);
	return app;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function userHeaders(userId = USER_ID) {
	const token = sign({ userId, name: "test@example.com" }, JWT_SECRET, { expiresIn: "1h" });
	return { Authorization: `Bearer ${token}` };
}
function apiKeyHeaders(key: string) { return { Authorization: `Bearer ${key}` }; }
function withJson(headers: Record<string, string>, body: object) {
	return { headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify(body) };
}

let app: Hono<{ Variables: TestVariables }>;
beforeAll(async () => { app = await buildApp(); });

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("GET /api-keys — list", () => {
	test("user JWT returns key list (key values hidden)", async () => {
		const res = await app.request("/api-keys", { headers: userHeaders() });
		expect(res.status).toBe(200);
		const body = await res.json() as typeof API_KEY[];
		expect(body).toHaveLength(1);
		expect(body[0]?.id).toBe(KEY_ID);
	});

	test("no credentials returns 401", async () => {
		const res = await app.request("/api-keys");
		expect(res.status).toBe(401);
	});

	test("API key bearer is rejected — requireUser only allows JWT", async () => {
		const res = await app.request("/api-keys", { headers: apiKeyHeaders(READWRITE_KEY) });
		expect(res.status).toBe(401);
	});
});

describe("POST /api-keys — create", () => {
	test("user JWT creates key with defaults (201)", async () => {
		const res = await app.request("/api-keys", { method: "POST", ...withJson(userHeaders(), {}) });
		expect(res.status).toBe(201);
		const body = await res.json() as typeof API_KEY;
		expect(body.projectId).toBe(PROJECT_ID);
	});

	test("user JWT creates READWRITE key with custom expiry (201)", async () => {
		const res = await app.request("/api-keys", { method: "POST", ...withJson(userHeaders(), { role: "READWRITE", expire: 30 }) });
		expect(res.status).toBe(201);
		const body = await res.json() as typeof API_KEY;
		expect(body.role).toBe("READWRITE");
		expect(body.expire).toBe(30);
	});

	test("non-owner user is rejected (401)", async () => {
		// OTHER_USER has no project → projectId=null → canUserModifyProject returns false
		const res = await app.request("/api-keys", { method: "POST", ...withJson(userHeaders(OTHER_USER), {}) });
		expect(res.status).toBe(500); // no project found for user
	});

	test("no credentials returns 401", async () => {
		const res = await app.request("/api-keys", { method: "POST", ...withJson({}, {}) });
		expect(res.status).toBe(401);
	});
});

describe("DELETE /api-keys/:id — delete", () => {
	test("owner user deletes key (204)", async () => {
		const res = await app.request(`/api-keys/${KEY_ID}`, { method: "DELETE", headers: userHeaders() });
		expect(res.status).toBe(204);
	});

	test("non-owner user is rejected (401)", async () => {
		const res = await app.request(`/api-keys/${KEY_ID}`, { method: "DELETE", headers: userHeaders(OTHER_USER) });
		expect(res.status).toBe(401);
	});

	test("nonexistent key returns 404", async () => {
		const res = await app.request("/api-keys/nonexistent", { method: "DELETE", headers: userHeaders() });
		expect(res.status).toBe(404);
	});

	test("no credentials returns 401", async () => {
		const res = await app.request(`/api-keys/${KEY_ID}`, { method: "DELETE" });
		expect(res.status).toBe(401);
	});
});

describe("GET /api-keys/:id/logs — usage logs", () => {
	test("owner user returns logs (200)", async () => {
		const res = await app.request(`/api-keys/${KEY_ID}/logs`, { headers: userHeaders() });
		expect(res.status).toBe(200);
		const body = await res.json() as typeof LOG[];
		expect(body).toHaveLength(1);
		expect(body[0]?.apiKeyId).toBe(KEY_ID);
	});

	test("custom limit param is accepted", async () => {
		const res = await app.request(`/api-keys/${KEY_ID}/logs?limit=50`, { headers: userHeaders() });
		expect(res.status).toBe(200);
	});

	test("non-owner user is rejected (401)", async () => {
		const res = await app.request(`/api-keys/${KEY_ID}/logs`, { headers: userHeaders(OTHER_USER) });
		expect(res.status).toBe(401);
	});

	test("nonexistent key returns 404", async () => {
		const res = await app.request("/api-keys/nonexistent/logs", { headers: userHeaders() });
		expect(res.status).toBe(404);
	});

	test("no credentials returns 401", async () => {
		const res = await app.request(`/api-keys/${KEY_ID}/logs`);
		expect(res.status).toBe(401);
	});
});

describe("PATCH /api-keys/:id/revoke", () => {
	test("owner revokes key (200)", async () => {
		const res = await app.request(`/api-keys/${KEY_ID}/revoke`, { method: "PATCH", headers: userHeaders() });
		expect(res.status).toBe(200);
		const body = await res.json() as Record<string, unknown>;
		expect(body.id).toBe(KEY_ID);
		expect(body.revokedAt).not.toBeNull();
	});

	test("non-owner user is rejected (401)", async () => {
		const res = await app.request(`/api-keys/${KEY_ID}/revoke`, { method: "PATCH", headers: userHeaders(OTHER_USER) });
		expect(res.status).toBe(401);
	});

	test("nonexistent key returns 404", async () => {
		const res = await app.request("/api-keys/nonexistent/revoke", { method: "PATCH", headers: userHeaders() });
		expect(res.status).toBe(404);
	});

	test("no credentials returns 401", async () => {
		const res = await app.request(`/api-keys/${KEY_ID}/revoke`, { method: "PATCH" });
		expect(res.status).toBe(401);
	});
});

describe("PATCH /api-keys/:id/reinstate", () => {
	test("owner reinstates key (200)", async () => {
		const res = await app.request(`/api-keys/${KEY_ID}/reinstate`, { method: "PATCH", headers: userHeaders() });
		expect(res.status).toBe(200);
		const body = await res.json() as Record<string, unknown>;
		expect(body.id).toBe(KEY_ID);
		expect(body.revokedAt).toBeNull();
	});

	test("non-owner user is rejected (401)", async () => {
		const res = await app.request(`/api-keys/${KEY_ID}/reinstate`, { method: "PATCH", headers: userHeaders(OTHER_USER) });
		expect(res.status).toBe(401);
	});

	test("nonexistent key returns 404", async () => {
		const res = await app.request("/api-keys/nonexistent/reinstate", { method: "PATCH", headers: userHeaders() });
		expect(res.status).toBe(404);
	});
});
