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

const READONLY_KEY = `dv_aaaaaaaa_${"a".repeat(64)}`;
const READWRITE_KEY = `dv_bbbbbbbb_${"b".repeat(64)}`;

const PROJECT_ID = "proj-1";
const USER_ID = "user-1";
const DS_ID = "ds-1";
const CHART_ID = "chart-1";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const DS = {
	id: DS_ID,
	projectId: PROJECT_ID,
	name: "Test DataSource",
	description: null,
	data: [],
	rules: null,
	publish: false,
	isTrasposed: false,
	remoteUrl: null,
	isRemote: false,
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
};

const LINK = {
	dataSourceId: DS_ID,
	chartId: CHART_ID,
	config: null,
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
};

// ─── Mocks ────────────────────────────────────────────────────────────────────

mock.module("../lib/logger", () => ({
	logger: { debug: mock(() => { }), info: mock(() => { }), warn: mock(() => { }), error: mock(() => { }) },
	httpLogger: mock(async (_c: unknown, next: () => Promise<void>) => next()),
	logStartup: mock(() => { }),
}));

mock.module("../lib/db/apiKeyDb", () => ({
	findApiKeyByRawKey: mock(async (key: string) => {
		if (key === READONLY_KEY) return { id: "key-ro", prefix: "aaaaaaaa", keyHash: "hash_ro", role: "READONLY", expire: 60, revokedAt: null, projectId: PROJECT_ID, createdAt: new Date(), updatedAt: new Date() };
		if (key === READWRITE_KEY) return { id: "key-rw", prefix: "bbbbbbbb", keyHash: "hash_rw", role: "READWRITE", expire: 60, revokedAt: null, projectId: PROJECT_ID, createdAt: new Date(), updatedAt: new Date() };
		return null;
	}),
	revokeApiKey: mock(async () => undefined),
	reinstateApiKey: mock(async () => undefined),
	createApiLog: mock(async () => undefined),
}));

mock.module("../lib/db/projectDb", () => ({
	getDefaultProjectId: mock(async (userId: string) => userId === USER_ID ? PROJECT_ID : null),
	canUserModifyProject: mock(async (userId: string, projectId: string) => userId === USER_ID && projectId === PROJECT_ID),
}));

mock.module("../lib/db", () => ({
	default: {
		findDataSourcesByProjectId: mock(async () => [DS]),
		findDataSourceById: mock(async (id: string) => id === DS_ID ? DS : null),
		createDataSource: mock(async (data: object) => ({ ...DS, ...data })),
		updateDataSource: mock(async (id: string, data: object) => ({ ...DS, id, ...data })),
		deleteDataSource: mock(async () => undefined),
		findSourceLinksByDataSource: mock(async () => [LINK]),
		createSourceLink: mock(async () => LINK),
		deleteSourceLink: mock(async () => undefined),
	},
}));

// ─── App builder ─────────────────────────────────────────────────────────────

async function buildApp() {
	const { default: dsRouter } = await import("../routes/datasources");
	const app = new Hono<{ Variables: TestVariables }>();
	app.route("/datasources", dsRouter);
	return app;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function userHeaders() {
	const token = sign({ userId: USER_ID, name: "test@example.com" }, JWT_SECRET, { expiresIn: "1h" });
	return { Authorization: `Bearer ${token}` };
}
function apiKeyHeaders(key: string) { return { Authorization: `Bearer ${key}` }; }
function withJson(headers: Record<string, string>, body: object) {
	return { headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify(body) };
}

let app: Hono<{ Variables: TestVariables }>;
beforeAll(async () => { app = await buildApp(); });

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("GET /datasources — list", () => {
	test("user JWT returns datasource list", async () => {
		const res = await app.request("/datasources", { headers: userHeaders() });
		expect(res.status).toBe(200);
		const body = await res.json() as typeof DS[];
		expect(body).toHaveLength(1);
		expect(body[0]?.id).toBe(DS_ID);
	});

	test("READONLY API key returns datasource list", async () => {
		const res = await app.request("/datasources", { headers: apiKeyHeaders(READONLY_KEY) });
		expect(res.status).toBe(200);
	});

	test("no credentials returns 401", async () => {
		const res = await app.request("/datasources");
		expect(res.status).toBe(401);
	});
});

describe("GET /datasources/:id — single", () => {
	test("owner (user JWT) returns the datasource", async () => {
		const res = await app.request(`/datasources/${DS_ID}`, { headers: userHeaders() });
		expect(res.status).toBe(200);
		const body = await res.json() as typeof DS;
		expect(body.id).toBe(DS_ID);
	});

	test("READONLY API key scoped to the project can read", async () => {
		const res = await app.request(`/datasources/${DS_ID}`, { headers: apiKeyHeaders(READONLY_KEY) });
		expect(res.status).toBe(200);
	});

	test("no credentials → 401 (not an anonymous cross-tenant read)", async () => {
		const res = await app.request(`/datasources/${DS_ID}`);
		expect(res.status).toBe(401);
	});

	test("returns 404 when datasource does not exist", async () => {
		const res = await app.request("/datasources/nonexistent", { headers: userHeaders() });
		expect(res.status).toBe(404);
	});
});

describe("POST /datasources — create", () => {
	const payload = { data: [], name: "New Source" };

	test("user JWT creates datasource (201)", async () => {
		const res = await app.request("/datasources", { method: "POST", ...withJson(userHeaders(), payload) });
		expect(res.status).toBe(201);
		const body = await res.json() as typeof DS;
		expect(body.projectId).toBe(PROJECT_ID);
	});

	test("READWRITE API key creates datasource (201)", async () => {
		const res = await app.request("/datasources", { method: "POST", ...withJson(apiKeyHeaders(READWRITE_KEY), payload) });
		expect(res.status).toBe(201);
	});

	test("READONLY API key is rejected (403)", async () => {
		const res = await app.request("/datasources", { method: "POST", ...withJson(apiKeyHeaders(READONLY_KEY), payload) });
		expect(res.status).toBe(403);
	});

	test("no credentials returns 401", async () => {
		const res = await app.request("/datasources", { method: "POST", ...withJson({}, payload) });
		expect(res.status).toBe(401);
	});
});

describe("PUT /datasources/:id — update", () => {
	const payload = { name: "Updated Source" };

	test("user JWT updates datasource (200)", async () => {
		const res = await app.request(`/datasources/${DS_ID}`, { method: "PUT", ...withJson(userHeaders(), payload) });
		expect(res.status).toBe(200);
	});

	test("READWRITE API key updates datasource (200)", async () => {
		const res = await app.request(`/datasources/${DS_ID}`, { method: "PUT", ...withJson(apiKeyHeaders(READWRITE_KEY), payload) });
		expect(res.status).toBe(200);
	});

	test("READONLY API key is rejected (403)", async () => {
		const res = await app.request(`/datasources/${DS_ID}`, { method: "PUT", ...withJson(apiKeyHeaders(READONLY_KEY), payload) });
		expect(res.status).toBe(403);
	});

	test("no credentials returns 401", async () => {
		const res = await app.request(`/datasources/${DS_ID}`, { method: "PUT", ...withJson({}, payload) });
		expect(res.status).toBe(401);
	});

	test("nonexistent datasource returns 404", async () => {
		const res = await app.request("/datasources/nonexistent", { method: "PUT", ...withJson(userHeaders(), payload) });
		expect(res.status).toBe(404);
	});
});

describe("DELETE /datasources/:id — delete", () => {
	test("user JWT deletes datasource (204)", async () => {
		const res = await app.request(`/datasources/${DS_ID}`, { method: "DELETE", headers: userHeaders() });
		expect(res.status).toBe(204);
	});

	test("READWRITE API key deletes datasource (204)", async () => {
		const res = await app.request(`/datasources/${DS_ID}`, { method: "DELETE", headers: apiKeyHeaders(READWRITE_KEY) });
		expect(res.status).toBe(204);
	});

	test("READONLY API key is rejected (403)", async () => {
		const res = await app.request(`/datasources/${DS_ID}`, { method: "DELETE", headers: apiKeyHeaders(READONLY_KEY) });
		expect(res.status).toBe(403);
	});

	test("no credentials returns 401", async () => {
		const res = await app.request(`/datasources/${DS_ID}`, { method: "DELETE" });
		expect(res.status).toBe(401);
	});

	test("nonexistent datasource returns 404", async () => {
		const res = await app.request("/datasources/nonexistent", { method: "DELETE", headers: userHeaders() });
		expect(res.status).toBe(404);
	});
});

describe("GET /datasources/:id/links — list links", () => {
	test("user JWT returns links (200)", async () => {
		const res = await app.request(`/datasources/${DS_ID}/links`, { headers: userHeaders() });
		expect(res.status).toBe(200);
		const body = await res.json() as typeof LINK[];
		expect(body).toHaveLength(1);
		expect(body[0]?.chartId).toBe(CHART_ID);
	});

	test("READONLY API key returns links (200)", async () => {
		const res = await app.request(`/datasources/${DS_ID}/links`, { headers: apiKeyHeaders(READONLY_KEY) });
		expect(res.status).toBe(200);
	});

	test("no credentials returns 401", async () => {
		const res = await app.request(`/datasources/${DS_ID}/links`);
		expect(res.status).toBe(401);
	});

	test("nonexistent datasource returns 404", async () => {
		const res = await app.request("/datasources/nonexistent/links", { headers: userHeaders() });
		expect(res.status).toBe(404);
	});
});

describe("POST /datasources/:id/links — create link", () => {
	const payload = { chartId: CHART_ID };

	test("user JWT creates link (201)", async () => {
		const res = await app.request(`/datasources/${DS_ID}/links`, { method: "POST", ...withJson(userHeaders(), payload) });
		expect(res.status).toBe(201);
	});

	test("READWRITE API key creates link (201)", async () => {
		const res = await app.request(`/datasources/${DS_ID}/links`, { method: "POST", ...withJson(apiKeyHeaders(READWRITE_KEY), payload) });
		expect(res.status).toBe(201);
	});

	test("READONLY API key is rejected (403)", async () => {
		const res = await app.request(`/datasources/${DS_ID}/links`, { method: "POST", ...withJson(apiKeyHeaders(READONLY_KEY), payload) });
		expect(res.status).toBe(403);
	});

	test("nonexistent datasource returns 404", async () => {
		const res = await app.request("/datasources/nonexistent/links", { method: "POST", ...withJson(userHeaders(), payload) });
		expect(res.status).toBe(404);
	});
});

describe("DELETE /datasources/:id/links/:chartId — delete link", () => {
	test("user JWT deletes link (204)", async () => {
		const res = await app.request(`/datasources/${DS_ID}/links/${CHART_ID}`, { method: "DELETE", headers: userHeaders() });
		expect(res.status).toBe(204);
	});

	test("READWRITE API key deletes link (204)", async () => {
		const res = await app.request(`/datasources/${DS_ID}/links/${CHART_ID}`, { method: "DELETE", headers: apiKeyHeaders(READWRITE_KEY) });
		expect(res.status).toBe(204);
	});

	test("READONLY API key is rejected (403)", async () => {
		const res = await app.request(`/datasources/${DS_ID}/links/${CHART_ID}`, { method: "DELETE", headers: apiKeyHeaders(READONLY_KEY) });
		expect(res.status).toBe(403);
	});

	test("no credentials returns 401", async () => {
		const res = await app.request(`/datasources/${DS_ID}/links/${CHART_ID}`, { method: "DELETE" });
		expect(res.status).toBe(401);
	});
});
