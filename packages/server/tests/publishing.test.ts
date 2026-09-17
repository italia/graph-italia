import { afterEach, beforeAll, describe, expect, mock, test } from "bun:test";
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
const PUBLISHED_CHART_ID = "chart-2";
const DASH_ID = "dash-1";
const PUBLISHED_DASH_ID = "dash-2";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const CHART = {
	id: CHART_ID,
	projectId: PROJECT_ID,
	name: "Private Chart",
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
const PUBLISHED_CHART = { ...CHART, id: PUBLISHED_CHART_ID, publish: true };

const DASH = {
	id: DASH_ID,
	projectId: PROJECT_ID,
	name: "Private Dashboard",
	description: null,
	publish: false,
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
};
const PUBLISHED_DASH = { ...DASH, id: PUBLISHED_DASH_ID, publish: true };

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
		findChartById: mock(async (id: string) =>
			id === CHART_ID ? CHART : id === PUBLISHED_CHART_ID ? PUBLISHED_CHART : null,
		),
		createChart: mock(async (data: object) => ({ ...CHART, ...data })),
		updateChart: mock(async (id: string, data: object) => ({ ...CHART, id, ...data })),
		publishChart: mock(async (_id: string, publish: boolean) => ({ ...CHART, publish })),
		findDashboardByIdWithIncludes: mock(async (id: string) =>
			id === DASH_ID ? { ...DASH, slots: [] } : id === PUBLISHED_DASH_ID ? { ...PUBLISHED_DASH, slots: [] } : null,
		),
		dashboardDb: {
			create: mock(async (data: object) => ({ ...DASH, ...data })),
			findById: mock(async (id: string) => id === DASH_ID ? DASH : null),
			update: mock(async (id: string, data: object) => ({ ...DASH, id, ...data })),
		},
	},
}));

// ─── App builder ─────────────────────────────────────────────────────────────

async function buildApp() {
	const { default: chartsRouter } = await import("../routes/charts");
	const { default: dashRouter } = await import("../routes/dashboards");
	const app = new Hono<{ Variables: TestVariables }>();
	app.route("/charts", chartsRouter);
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

/** The flag is read from the environment on every call, so tests can flip it. */
function disablePublishing() { process.env["ENABLE_PUBLIC_PUBLISHING"] = "false"; }

let app: Hono<{ Variables: TestVariables }>;
beforeAll(async () => { app = await buildApp(); });
afterEach(() => { delete process.env["ENABLE_PUBLIC_PUBLISHING"]; });

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("public publishing enabled (default)", () => {
	test("published chart is readable anonymously", async () => {
		const res = await app.request(`/charts/show/${PUBLISHED_CHART_ID}`);
		expect(res.status).toBe(200);
	});

	test("published dashboard is readable anonymously", async () => {
		const res = await app.request(`/dashboards/show/${PUBLISHED_DASH_ID}`);
		expect(res.status).toBe(200);
	});

	test("publish toggle works", async () => {
		const res = await app.request(`/charts/publish/${CHART_ID}`, { method: "POST", headers: userHeaders() });
		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({ published: true });
	});

	test("update keeps publish: true", async () => {
		const res = await app.request(`/charts/${CHART_ID}`, {
			method: "PUT",
			...withJson(userHeaders(), { publish: true }),
		});
		expect(res.status).toBe(200);
		expect((await res.json() as { publish: boolean }).publish).toBe(true);
	});
});

describe("public publishing disabled", () => {
	test("chart show is 404 even for a published chart", async () => {
		disablePublishing();
		const res = await app.request(`/charts/show/${PUBLISHED_CHART_ID}`);
		expect(res.status).toBe(404);
	});

	test("dashboard show is 404 even for a published dashboard", async () => {
		disablePublishing();
		const res = await app.request(`/dashboards/show/${PUBLISHED_DASH_ID}`);
		expect(res.status).toBe(404);
	});

	test("authenticated read still works — the point of the flag", async () => {
		disablePublishing();
		const res = await app.request(`/charts/${CHART_ID}`, { headers: apiKeyHeaders(READONLY_KEY) });
		expect(res.status).toBe(200);
	});

	test("authenticated dashboard read still works", async () => {
		disablePublishing();
		const res = await app.request(`/dashboards/${DASH_ID}`, { headers: apiKeyHeaders(READONLY_KEY) });
		expect(res.status).toBe(200);
	});

	test("publish toggle on a private chart is 403", async () => {
		disablePublishing();
		const res = await app.request(`/charts/publish/${CHART_ID}`, { method: "POST", headers: userHeaders() });
		expect(res.status).toBe(403);
	});

	test("unpublishing an already published chart is still allowed", async () => {
		disablePublishing();
		const res = await app.request(`/charts/publish/${PUBLISHED_CHART_ID}`, { method: "POST", headers: userHeaders() });
		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({ published: false });
	});

	test("chart update cannot set publish: true", async () => {
		disablePublishing();
		const res = await app.request(`/charts/${CHART_ID}`, {
			method: "PUT",
			...withJson(userHeaders(), { publish: true }),
		});
		expect(res.status).toBe(200);
		expect((await res.json() as { publish: boolean }).publish).toBe(false);
	});

	test("chart create cannot set publish: true", async () => {
		disablePublishing();
		const res = await app.request("/charts", {
			method: "POST",
			...withJson(apiKeyHeaders(READWRITE_KEY), { chart: "bar", description: "desc", publish: true }),
		});
		expect(res.status).toBe(201);
		expect((await res.json() as { publish: boolean }).publish).toBe(false);
	});

	test("dashboard update cannot set publish: true", async () => {
		disablePublishing();
		const res = await app.request(`/dashboards/${DASH_ID}`, {
			method: "PUT",
			...withJson(userHeaders(), { publish: true }),
		});
		expect(res.status).toBe(200);
		expect((await res.json() as { publish: boolean }).publish).toBe(false);
	});
});
