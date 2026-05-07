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
const CHART_ID = "chart-1";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const CHART = {
	id: CHART_ID,
	projectId: PROJECT_ID,
	name: "Test Chart",
	description: null,
	chart: "bar",
	dataSource: null,
	config: null,
	data: null,
	isRemote: false,
	remoteUrl: null,
	publish: false,
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
};

// ─── Mocks ────────────────────────────────────────────────────────────────────

mock.module("../lib/logger", () => ({
	logger: {
		debug: mock(() => { }),
		info: mock(() => { }),
		warn: mock(() => { }),
		error: mock(() => { }),
	},
	httpLogger: mock(async (_c: unknown, next: () => Promise<void>) => next()),
	logStartup: mock(() => { }),
}));

mock.module("../lib/db/apiKeyDb", () => ({
	findApiKeyByRawKey: mock(async (key: string) => {
		if (key === READONLY_KEY) {
			return { id: "key-ro", prefix: "aaaaaaaa", keyHash: "hash_ro", role: "READONLY", expire: 60, revokedAt: null, projectId: PROJECT_ID, createdAt: new Date(), updatedAt: new Date() };
		}
		if (key === READWRITE_KEY) {
			return { id: "key-rw", prefix: "bbbbbbbb", keyHash: "hash_rw", role: "READWRITE", expire: 60, revokedAt: null, projectId: PROJECT_ID, createdAt: new Date(), updatedAt: new Date() };
		}
		return null;
	}),
	revokeApiKey: mock(async () => undefined),
	reinstateApiKey: mock(async () => undefined),
	createApiLog: mock(async () => undefined),
}));

mock.module("../lib/db/projectDb", () => ({
	getDefaultProjectId: mock(async (userId: string) => userId === USER_ID ? PROJECT_ID : null),
	canUserModifyProject: mock(async (userId: string, projectId: string) =>
		userId === USER_ID && projectId === PROJECT_ID,
	),
}));

mock.module("../lib/db", () => ({
	default: {
		// List
		findChartsByProjectId: mock(async () => [CHART]),
		// Single
		findChartById: mock(async (id: string) => id === CHART_ID ? CHART : null),
		// Create
		createChart: mock(async (data: object) => ({ ...CHART, ...data })),
		// Update
		updateChart: mock(async (id: string, data: object) => ({ ...CHART, id, ...data })),
		// Delete
		deleteChart: mock(async () => CHART),
		// Publish
		publishChart: mock(async (_id: string, publish: boolean) => ({ ...CHART, publish })),
		// Needed by canUserModifyProject path via db (not used since we mock projectDb directly)
		canUserModifyProject: mock(async () => true),
	},
}));

// ─── App builder ─────────────────────────────────────────────────────────────

async function buildApp() {
	const { default: chartsRouter } = await import("../routes/charts");

	// Mirror index.ts: just mount the router, no outer middleware.
	// The charts router owns its own checkAuth + requireAuth internally.
	const app = new Hono<{ Variables: TestVariables }>();
	app.route("/charts", chartsRouter);
	return app;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function userHeaders(userId = USER_ID) {
	const token = sign({ userId, name: "test@example.com" }, JWT_SECRET, { expiresIn: "1h" });
	return { Authorization: `Bearer ${token}` };
}

function apiKeyHeaders(key: string) {
	return { Authorization: `Bearer ${key}` };
}

function withJson(authHeaders: Record<string, string>, body: object) {
	return {
		headers: { ...authHeaders, "Content-Type": "application/json" },
		body: JSON.stringify(body),
	};
}

// ─── Tests ────────────────────────────────────────────────────────────────────

let app: Hono<{ Variables: TestVariables }>;

beforeAll(async () => {
	app = await buildApp();
});

// ── GET / ─────────────────────────────────────────────────────────────────────

describe("GET /charts — list", () => {
	test("user JWT returns chart list for their default project", async () => {
		const res = await app.request("/charts", { headers: userHeaders() });
		expect(res.status).toBe(200);
		const body = await res.json() as typeof CHART[];
		expect(body).toHaveLength(1);
		expect(body[0]?.id).toBe(CHART_ID);
	});

	test("READONLY API key returns chart list", async () => {
		const res = await app.request("/charts", { headers: apiKeyHeaders(READONLY_KEY) });
		expect(res.status).toBe(200);
		const body = await res.json() as typeof CHART[];
		expect(body).toHaveLength(1);
	});

	test("READWRITE API key returns chart list", async () => {
		const res = await app.request("/charts", { headers: apiKeyHeaders(READWRITE_KEY) });
		expect(res.status).toBe(200);
	});

	test("no credentials returns 401", async () => {
		const res = await app.request("/charts");
		expect(res.status).toBe(401);
	});
});

// ── GET /:id ──────────────────────────────────────────────────────────────────

describe("GET /charts/:id — single", () => {
	test("returns chart when it exists (no auth required)", async () => {
		const res = await app.request(`/charts/${CHART_ID}`);
		expect(res.status).toBe(200);
		const body = await res.json() as typeof CHART;
		expect(body.id).toBe(CHART_ID);
	});

	test("returns 404 when chart does not exist", async () => {
		const res = await app.request("/charts/nonexistent");
		expect(res.status).toBe(404);
	});
});

// ── POST / ────────────────────────────────────────────────────────────────────

describe("POST /charts — create", () => {
	const payload = { chart: "bar", name: "New Chart" };

	test("user JWT creates a chart (201)", async () => {
		const res = await app.request("/charts", { method: "POST", ...withJson(userHeaders(), payload) });
		expect(res.status).toBe(201);
		const body = await res.json() as typeof CHART;
		expect(body.chart).toBe("bar");
		expect(body.projectId).toBe(PROJECT_ID);
	});

	test("READWRITE API key creates a chart (201)", async () => {
		const res = await app.request("/charts", { method: "POST", ...withJson(apiKeyHeaders(READWRITE_KEY), payload) });
		expect(res.status).toBe(201);
	});

	test("READONLY API key is rejected (403)", async () => {
		const res = await app.request("/charts", { method: "POST", ...withJson(apiKeyHeaders(READONLY_KEY), payload) });
		expect(res.status).toBe(403);
	});

	test("no credentials returns 401", async () => {
		const res = await app.request("/charts", { method: "POST", ...withJson({}, payload) });
		expect(res.status).toBe(401);
	});

	test("missing required field 'chart' returns 400", async () => {
		const res = await app.request("/charts", { method: "POST", ...withJson(userHeaders(), { name: "No type" }) });
		expect(res.status).toBe(400);
	});
});

// ── PUT /:id ──────────────────────────────────────────────────────────────────

describe("PUT /charts/:id — update", () => {
	const payload = { name: "Updated Chart" };

	test("user JWT updates chart (200)", async () => {
		const res = await app.request(`/charts/${CHART_ID}`, { method: "PUT", ...withJson(userHeaders(), payload) });
		expect(res.status).toBe(200);
		const body = await res.json() as typeof CHART;
		expect(body.id).toBe(CHART_ID);
	});

	test("READWRITE API key updates chart (200)", async () => {
		const res = await app.request(`/charts/${CHART_ID}`, { method: "PUT", ...withJson(apiKeyHeaders(READWRITE_KEY), payload) });
		expect(res.status).toBe(200);
	});

	test("READONLY API key is rejected (403)", async () => {
		const res = await app.request(`/charts/${CHART_ID}`, { method: "PUT", ...withJson(apiKeyHeaders(READONLY_KEY), payload) });
		expect(res.status).toBe(403);
	});

	test("no credentials returns 401", async () => {
		const res = await app.request(`/charts/${CHART_ID}`, { method: "PUT", ...withJson({}, payload) });
		expect(res.status).toBe(401);
	});

	test("nonexistent chart returns 404", async () => {
		const res = await app.request("/charts/nonexistent", { method: "PUT", ...withJson(userHeaders(), payload) });
		expect(res.status).toBe(404);
	});
});

// ── DELETE /:id ───────────────────────────────────────────────────────────────

describe("DELETE /charts/:id — delete", () => {
	test("user JWT deletes chart (200)", async () => {
		const res = await app.request(`/charts/${CHART_ID}`, {
			method: "DELETE",
			headers: userHeaders(),
		});
		expect(res.status).toBe(200);
		const body = await res.json() as typeof CHART;
		expect(body.id).toBe(CHART_ID);
	});

	test("READWRITE API key deletes chart (200)", async () => {
		const res = await app.request(`/charts/${CHART_ID}`, {
			method: "DELETE",
			headers: apiKeyHeaders(READWRITE_KEY),
		});
		expect(res.status).toBe(200);
	});

	test("READONLY API key is rejected (403)", async () => {
		const res = await app.request(`/charts/${CHART_ID}`, {
			method: "DELETE",
			headers: apiKeyHeaders(READONLY_KEY),
		});
		expect(res.status).toBe(403);
	});

	test("no credentials returns 401", async () => {
		const res = await app.request(`/charts/${CHART_ID}`, { method: "DELETE" });
		expect(res.status).toBe(401);
	});

	test("nonexistent chart returns 404", async () => {
		const res = await app.request("/charts/nonexistent", {
			method: "DELETE",
			headers: userHeaders(),
		});
		expect(res.status).toBe(404);
	});
});

// ── POST /publish/:id ─────────────────────────────────────────────────────────

describe("POST /charts/publish/:id — toggle publish", () => {
	test("user JWT toggles publish state (200)", async () => {
		const res = await app.request(`/charts/publish/${CHART_ID}`, {
			method: "POST",
			headers: userHeaders(),
		});
		expect(res.status).toBe(200);
		const body = await res.json() as { published: boolean };
		expect(typeof body.published).toBe("boolean");
	});

	test("READWRITE API key can toggle publish (200)", async () => {
		const res = await app.request(`/charts/publish/${CHART_ID}`, {
			method: "POST",
			headers: apiKeyHeaders(READWRITE_KEY),
		});
		expect(res.status).toBe(200);
	});

	test("READONLY API key is rejected (403)", async () => {
		const res = await app.request(`/charts/publish/${CHART_ID}`, {
			method: "POST",
			headers: apiKeyHeaders(READONLY_KEY),
		});
		expect(res.status).toBe(403);
	});

	test("no credentials returns 401", async () => {
		const res = await app.request(`/charts/publish/${CHART_ID}`, { method: "POST" });
		expect(res.status).toBe(401);
	});

	test("nonexistent chart returns 404", async () => {
		const res = await app.request("/charts/publish/nonexistent", {
			method: "POST",
			headers: userHeaders(),
		});
		expect(res.status).toBe(404);
	});
});
