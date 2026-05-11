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
const DASH_ID = "dash-1";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const DASH = {
	id: DASH_ID,
	projectId: PROJECT_ID,
	name: "Test Dashboard",
	description: null,
	config: null,
	data: null,
	isRemote: false,
	remoteUrl: null,
	publish: false,
	preview: null,
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
};

const DASH_WITH_SLOTS = { ...DASH, slots: [] };

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
		// List
		findDashboardsByProjectId: mock(async () => [DASH]),
		// Single / includes
		findDashboardByIdWithIncludes: mock(async (id: string) => id === DASH_ID ? DASH_WITH_SLOTS : null),
		// Create / update / delete
		dashboardDb: {
			create: mock(async (data: object) => ({ ...DASH, ...data })),
			findById: mock(async (id: string) => id === DASH_ID ? DASH : null),
			update: mock(async (id: string, data: object) => ({ ...DASH, id, ...data })),
		},
		deleteDashboardById: mock(async () => undefined),
		// Slots
		findSlots: mock(async (id: string) => id === DASH_ID ? DASH_WITH_SLOTS : null),
		separateCreateUpdateDeleteSlots: mock((_stored: unknown[], updated: unknown[], _key: unknown) => ({
			toCreate: updated,
			toUpdate: [],
			toDelete: [],
		})),
		updateSlots: mock(async () => DASH_WITH_SLOTS),
	},
}));

// ─── App builder ─────────────────────────────────────────────────────────────

async function buildApp() {
	const { default: dashRouter } = await import("../routes/dashboards");
	const app = new Hono<{ Variables: TestVariables }>();
	app.route("/dashboards", dashRouter);
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

describe("GET /dashboards — list", () => {
	test("user JWT returns dashboard list", async () => {
		const res = await app.request("/dashboards", { headers: userHeaders() });
		expect(res.status).toBe(200);
		const body = await res.json() as typeof DASH[];
		expect(body).toHaveLength(1);
		expect(body[0]?.id).toBe(DASH_ID);
	});

	test("READONLY API key returns dashboard list", async () => {
		const res = await app.request("/dashboards", { headers: apiKeyHeaders(READONLY_KEY) });
		expect(res.status).toBe(200);
	});

	test("no credentials returns 401", async () => {
		const res = await app.request("/dashboards");
		expect(res.status).toBe(401);
	});
});

describe("GET /dashboards/:id — single", () => {
	test("user JWT returns dashboard", async () => {
		const res = await app.request(`/dashboards/${DASH_ID}`, { headers: userHeaders() });
		expect(res.status).toBe(200);
		const body = await res.json() as typeof DASH_WITH_SLOTS;
		expect(body.id).toBe(DASH_ID);
	});

	test("READONLY API key returns dashboard", async () => {
		const res = await app.request(`/dashboards/${DASH_ID}`, { headers: apiKeyHeaders(READONLY_KEY) });
		expect(res.status).toBe(200);
	});

	test("no credentials returns 401", async () => {
		const res = await app.request(`/dashboards/${DASH_ID}`);
		expect(res.status).toBe(401);
	});
});

describe("GET /dashboards/show/:id — public", () => {
	test("returns 401 for unpublished dashboard (no auth needed)", async () => {
		const res = await app.request(`/dashboards/show/${DASH_ID}`);
		expect(res.status).toBe(401);
	});

	test("returns 404 for nonexistent dashboard", async () => {
		const res = await app.request("/dashboards/show/nonexistent");
		expect(res.status).toBe(404);
	});
});

describe("POST /dashboards — create", () => {
	const payload = { name: "New Dashboard" };

	test("user JWT creates dashboard (201)", async () => {
		const res = await app.request("/dashboards", { method: "POST", ...withJson(userHeaders(), payload) });
		expect(res.status).toBe(201);
		const body = await res.json() as typeof DASH;
		expect(body.projectId).toBe(PROJECT_ID);
	});

	test("READWRITE API key creates dashboard (201)", async () => {
		const res = await app.request("/dashboards", { method: "POST", ...withJson(apiKeyHeaders(READWRITE_KEY), payload) });
		expect(res.status).toBe(201);
	});

	test("READONLY API key is rejected (403)", async () => {
		const res = await app.request("/dashboards", { method: "POST", ...withJson(apiKeyHeaders(READONLY_KEY), payload) });
		expect(res.status).toBe(403);
	});

	test("no credentials returns 401", async () => {
		const res = await app.request("/dashboards", { method: "POST", ...withJson({}, payload) });
		expect(res.status).toBe(401);
	});
});

describe("PUT /dashboards/:id — update", () => {
	const payload = { name: "Updated Dashboard" };

	test("user JWT updates dashboard (200)", async () => {
		const res = await app.request(`/dashboards/${DASH_ID}`, { method: "PUT", ...withJson(userHeaders(), payload) });
		expect(res.status).toBe(200);
	});

	test("READWRITE API key updates dashboard (200)", async () => {
		const res = await app.request(`/dashboards/${DASH_ID}`, { method: "PUT", ...withJson(apiKeyHeaders(READWRITE_KEY), payload) });
		expect(res.status).toBe(200);
	});

	test("READONLY API key is rejected (403)", async () => {
		const res = await app.request(`/dashboards/${DASH_ID}`, { method: "PUT", ...withJson(apiKeyHeaders(READONLY_KEY), payload) });
		expect(res.status).toBe(403);
	});

	test("no credentials returns 401", async () => {
		const res = await app.request(`/dashboards/${DASH_ID}`, { method: "PUT", ...withJson({}, payload) });
		expect(res.status).toBe(401);
	});

	test("nonexistent dashboard returns 404", async () => {
		const res = await app.request("/dashboards/nonexistent", { method: "PUT", ...withJson(userHeaders(), payload) });
		expect(res.status).toBe(404);
	});
});

describe("PUT /dashboards/:id/slots — update slots", () => {
	const payload = { slots: [{ chartId: "chart-1" }] };

	test("user JWT updates slots (200)", async () => {
		const res = await app.request(`/dashboards/${DASH_ID}/slots`, { method: "PUT", ...withJson(userHeaders(), payload) });
		expect(res.status).toBe(200);
	});

	test("READWRITE API key updates slots (200)", async () => {
		const res = await app.request(`/dashboards/${DASH_ID}/slots`, { method: "PUT", ...withJson(apiKeyHeaders(READWRITE_KEY), payload) });
		expect(res.status).toBe(200);
	});

	test("READONLY API key is rejected (403)", async () => {
		const res = await app.request(`/dashboards/${DASH_ID}/slots`, { method: "PUT", ...withJson(apiKeyHeaders(READONLY_KEY), payload) });
		expect(res.status).toBe(403);
	});

	test("nonexistent dashboard returns 404", async () => {
		const res = await app.request("/dashboards/nonexistent/slots", { method: "PUT", ...withJson(userHeaders(), payload) });
		expect(res.status).toBe(404);
	});
});

describe("DELETE /dashboards/:id — delete", () => {
	test("user JWT deletes dashboard (204)", async () => {
		const res = await app.request(`/dashboards/${DASH_ID}`, { method: "DELETE", headers: userHeaders() });
		expect(res.status).toBe(204);
	});

	test("READWRITE API key deletes dashboard (204)", async () => {
		const res = await app.request(`/dashboards/${DASH_ID}`, { method: "DELETE", headers: apiKeyHeaders(READWRITE_KEY) });
		expect(res.status).toBe(204);
	});

	test("READONLY API key is rejected (403)", async () => {
		const res = await app.request(`/dashboards/${DASH_ID}`, { method: "DELETE", headers: apiKeyHeaders(READONLY_KEY) });
		expect(res.status).toBe(403);
	});

	test("no credentials returns 401", async () => {
		const res = await app.request(`/dashboards/${DASH_ID}`, { method: "DELETE" });
		expect(res.status).toBe(401);
	});

	test("nonexistent dashboard returns 404", async () => {
		const res = await app.request("/dashboards/nonexistent", { method: "DELETE", headers: userHeaders() });
		expect(res.status).toBe(404);
	});
});
