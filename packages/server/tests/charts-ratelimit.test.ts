// Rate-limit tests for POST /charts (chartCreateLimiter).
// Isolated in their own file so each run starts with a fresh MemoryStore.

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

const READWRITE_KEY = `dv_bbbbbbbb_${"b".repeat(64)}`;

// Use IDs that are unique to this file.  The rate limiter's MemoryStore is
// module-level (shared across Bun's test run), so using different keys
// ensures these tests never touch buckets owned by charts.test.ts.
const USER_ID    = "rl-user";   // not used in any other test file
const PROJECT_ID = "proj-rl";
const CHART_ID   = "chart-rl";

const RATE_LIMIT = 20; // must match the limit in routes/charts.ts

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
	logger: { debug: mock(() => {}), info: mock(() => {}), warn: mock(() => {}), error: mock(() => {}) },
	httpLogger:  mock(async (_c: unknown, next: () => Promise<void>) => next()),
	logStartup:  mock(() => {}),
}));

mock.module("../lib/db/apiKeyDb", () => ({
	findApiKeyByRawKey: mock(async (key: string) => {
		if (key === READWRITE_KEY) {
			return { id: "key-rw", prefix: "bbbbbbbb", keyHash: "hash_rw", role: "READWRITE", expire: 60, revokedAt: null, projectId: PROJECT_ID, createdAt: new Date(), updatedAt: new Date() };
		}
		return null;
	}),
	revokeApiKey:    mock(async () => undefined),
	reinstateApiKey: mock(async () => undefined),
	createApiLog:    mock(async () => undefined),
}));

// Permissive mocks — this file tests rate-limiting only, not auth logic.
mock.module("../lib/db/projectDb", () => ({
	getDefaultProjectId:  mock(async () => PROJECT_ID),
	canUserModifyProject: mock(async () => true),
}));

mock.module("../lib/db", () => ({
	default: {
		findChartsByProjectId: mock(async () => [CHART]),
		findChartById:         mock(async (id: string) => id === CHART_ID ? CHART : null),
		createChart:           mock(async (data: object) => ({ ...CHART, ...data })),
		updateChart:           mock(async (id: string, data: object) => ({ ...CHART, id, ...data })),
		deleteChart:           mock(async () => CHART),
		publishChart:          mock(async (_id: string, publish: boolean) => ({ ...CHART, publish })),
		canUserModifyProject:  mock(async () => true),
	},
}));

// ─── App builder ─────────────────────────────────────────────────────────────

async function buildApp() {
	const { default: chartsRouter } = await import("../routes/charts");
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

function withJson(headers: Record<string, string>, body: object) {
	return { headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify(body) };
}

let app: Hono<{ Variables: TestVariables }>;
beforeAll(async () => { app = await buildApp(); });

// ─── Tests ────────────────────────────────────────────────────────────────────

const payload = { chart: "bar", name: "Rate-limit test" };

describe("POST /charts — chartCreateLimiter", () => {
	test("JWT user: first 20 requests succeed (201), 21st is blocked (429)", async () => {
		for (let i = 0; i < RATE_LIMIT; i++) {
			const res = await app.request("/charts", { method: "POST", ...withJson(userHeaders(), payload) });
			expect(res.status).toBe(201);
		}

		const blocked = await app.request("/charts", { method: "POST", ...withJson(userHeaders(), payload) });
		expect(blocked.status).toBe(429);
		const body = await blocked.json() as { error: string };
		expect(body.error).toContain("Too many");
	});

	// API key requests are keyed by x-forwarded-for (c.get("user") is null for API-key auth).
	// A unique IP gives this test its own isolated rate-limit bucket, independent from the
	// JWT test above.
	test("READWRITE API key: first 20 requests succeed (201), 21st is blocked (429)", async () => {
		const headers = {
			...apiKeyHeaders(READWRITE_KEY),
			"x-forwarded-for": "192.0.2.1", // TEST-NET — not used anywhere else in this file
		};

		for (let i = 0; i < RATE_LIMIT; i++) {
			const res = await app.request("/charts", { method: "POST", ...withJson(headers, payload) });
			expect(res.status).toBe(201);
		}

		const blocked = await app.request("/charts", { method: "POST", ...withJson(headers, payload) });
		expect(blocked.status).toBe(429);
		const body = await blocked.json() as { error: string };
		expect(body.error).toContain("Too many");
	});

	test("rate limit is per-user: a different IP is not affected by another bucket's exhaustion", async () => {
		// The JWT bucket ("user-1") and API key bucket ("192.0.2.1") are both exhausted above.
		// A fresh IP should still get through.
		const headers = {
			...apiKeyHeaders(READWRITE_KEY),
			"x-forwarded-for": "192.0.2.2", // different TEST-NET address → clean bucket
		};
		const res = await app.request("/charts", { method: "POST", ...withJson(headers, payload) });
		expect(res.status).toBe(201);
	});
});
