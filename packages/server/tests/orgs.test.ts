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

// API key — used only to verify requireUser rejects it
const READWRITE_KEY = "dv_bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";

const USER_ID     = "user-1";
const OTHER_USER  = "user-2";
const ORG_ID      = "org-1";
const OTHER_ORG   = "org-other"; // user-1 is NOT a member of this org

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const MEMBERSHIP = { userId: USER_ID, orgId: ORG_ID, role: "ADMIN", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };

const ORG = {
	id: ORG_ID,
	name: "Test Org",
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
	members: [MEMBERSHIP],
	projects: [],
};

const ORG_OTHER = { ...ORG, id: OTHER_ORG, members: [] };

// ─── Mocks ────────────────────────────────────────────────────────────────────

mock.module("../lib/logger", () => ({
	logger: { debug: mock(() => {}), info: mock(() => {}), warn: mock(() => {}), error: mock(() => {}) },
	httpLogger: mock(async (_c: unknown, next: () => Promise<void>) => next()),
	logStartup: mock(() => {}),
}));

mock.module("../lib/db/apiKeyDb", () => ({
	findApiKeyByRawKey: mock(async (key: string) => {
		if (key === READWRITE_KEY) return { id: "key-rw", key: READWRITE_KEY, role: "READWRITE", expire: 60, projectId: "proj-1", createdAt: new Date(), updatedAt: new Date() };
		return null;
	}),
}));

mock.module("../lib/db", () => ({
	default: {
		findOrgsByUserId: mock(async () => [ORG]),
		findOrgById: mock(async (id: string) => {
			if (id === ORG_ID)    return ORG;
			if (id === OTHER_ORG) return ORG_OTHER;
			return null;
		}),
		createOrg:          mock(async (name: string, userId: string) => ({ ...ORG, name, members: [{ ...MEMBERSHIP, userId }] })),
		updateOrg:          mock(async (id: string, name: string) => ({ ...ORG, id, name })),
		deleteOrg:          mock(async () => undefined),
		isOrgAdmin:         mock(async (userId: string, orgId: string) => userId === USER_ID && orgId === ORG_ID),
		findMembership:     mock(async (userId: string, orgId: string) => userId === USER_ID && orgId === ORG_ID ? MEMBERSHIP : null),
		addOrgMember:       mock(async (_orgId: string, userId: string) => ({ ...MEMBERSHIP, userId })),
		updateOrgMemberRole: mock(async (_orgId: string, userId: string, role: string) => ({ ...MEMBERSHIP, userId, role })),
		removeOrgMember:    mock(async () => undefined),
	},
}));

// ─── App builder ─────────────────────────────────────────────────────────────

async function buildApp() {
	const { default: orgsRouter } = await import("../routes/orgs");
	const app = new Hono<{ Variables: TestVariables }>();
	app.route("/orgs", orgsRouter);
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

describe("GET /orgs — list", () => {
	test("user JWT returns org list", async () => {
		const res = await app.request("/orgs", { headers: userHeaders() });
		expect(res.status).toBe(200);
		const body = await res.json() as typeof ORG[];
		expect(body).toHaveLength(1);
		expect(body[0]?.id).toBe(ORG_ID);
	});

	test("no credentials returns 401", async () => {
		const res = await app.request("/orgs");
		expect(res.status).toBe(401);
	});

	test("API key is rejected (requireUser)", async () => {
		const res = await app.request("/orgs", { headers: apiKeyHeaders(READWRITE_KEY) });
		expect(res.status).toBe(401);
	});
});

describe("GET /orgs/:id — single", () => {
	test("member user returns org (200)", async () => {
		const res = await app.request(`/orgs/${ORG_ID}`, { headers: userHeaders() });
		expect(res.status).toBe(200);
		const body = await res.json() as typeof ORG;
		expect(body.id).toBe(ORG_ID);
	});

	test("non-member user is rejected (401)", async () => {
		const res = await app.request(`/orgs/${OTHER_ORG}`, { headers: userHeaders() });
		expect(res.status).toBe(401);
	});

	test("nonexistent org returns 404", async () => {
		const res = await app.request("/orgs/nonexistent", { headers: userHeaders() });
		expect(res.status).toBe(404);
	});

	test("no credentials returns 401", async () => {
		const res = await app.request(`/orgs/${ORG_ID}`);
		expect(res.status).toBe(401);
	});
});

describe("POST /orgs — create", () => {
	test("user JWT creates org (201)", async () => {
		const res = await app.request("/orgs", { method: "POST", ...withJson(userHeaders(), { name: "New Org" }) });
		expect(res.status).toBe(201);
		const body = await res.json() as typeof ORG;
		expect(body.name).toBe("New Org");
	});

	test("no credentials returns 401", async () => {
		const res = await app.request("/orgs", { method: "POST", ...withJson({}, { name: "New Org" }) });
		expect(res.status).toBe(401);
	});
});

describe("PUT /orgs/:id — update", () => {
	test("ADMIN user updates org (200)", async () => {
		const res = await app.request(`/orgs/${ORG_ID}`, { method: "PUT", ...withJson(userHeaders(), { name: "Renamed Org" }) });
		expect(res.status).toBe(200);
	});

	test("non-admin user is rejected (401)", async () => {
		const res = await app.request(`/orgs/${ORG_ID}`, { method: "PUT", ...withJson(userHeaders(OTHER_USER), { name: "Hack" }) });
		expect(res.status).toBe(401);
	});

	test("no credentials returns 401", async () => {
		const res = await app.request(`/orgs/${ORG_ID}`, { method: "PUT", ...withJson({}, { name: "x" }) });
		expect(res.status).toBe(401);
	});
});

describe("DELETE /orgs/:id — delete", () => {
	test("ADMIN user deletes org (204)", async () => {
		const res = await app.request(`/orgs/${ORG_ID}`, { method: "DELETE", headers: userHeaders() });
		expect(res.status).toBe(204);
	});

	test("non-admin user is rejected (401)", async () => {
		const res = await app.request(`/orgs/${ORG_ID}`, { method: "DELETE", headers: userHeaders(OTHER_USER) });
		expect(res.status).toBe(401);
	});

	test("no credentials returns 401", async () => {
		const res = await app.request(`/orgs/${ORG_ID}`, { method: "DELETE" });
		expect(res.status).toBe(401);
	});
});

describe("GET /orgs/:id/members — list members", () => {
	test("member user returns members (200)", async () => {
		const res = await app.request(`/orgs/${ORG_ID}/members`, { headers: userHeaders() });
		expect(res.status).toBe(200);
	});

	test("non-member user is rejected (401)", async () => {
		const res = await app.request(`/orgs/${OTHER_ORG}/members`, { headers: userHeaders() });
		expect(res.status).toBe(401);
	});
});

describe("POST /orgs/:id/members — add member", () => {
	test("ADMIN user adds member (201)", async () => {
		const res = await app.request(`/orgs/${ORG_ID}/members`, { method: "POST", ...withJson(userHeaders(), { userId: OTHER_USER, role: "USER" }) });
		expect(res.status).toBe(201);
	});

	test("non-admin user is rejected (401)", async () => {
		const res = await app.request(`/orgs/${ORG_ID}/members`, { method: "POST", ...withJson(userHeaders(OTHER_USER), { userId: "user-3", role: "USER" }) });
		expect(res.status).toBe(401);
	});
});

describe("PUT /orgs/:id/members/:userId — update member role", () => {
	test("ADMIN user updates role (200)", async () => {
		const res = await app.request(`/orgs/${ORG_ID}/members/${OTHER_USER}`, { method: "PUT", ...withJson(userHeaders(), { role: "ADMIN" }) });
		expect(res.status).toBe(200);
	});

	test("non-admin user is rejected (401)", async () => {
		const res = await app.request(`/orgs/${ORG_ID}/members/${OTHER_USER}`, { method: "PUT", ...withJson(userHeaders(OTHER_USER), { role: "ADMIN" }) });
		expect(res.status).toBe(401);
	});
});

describe("DELETE /orgs/:id/members/:userId — remove member", () => {
	test("ADMIN user removes member (204)", async () => {
		const res = await app.request(`/orgs/${ORG_ID}/members/${OTHER_USER}`, { method: "DELETE", headers: userHeaders() });
		expect(res.status).toBe(204);
	});

	test("non-admin user is rejected (401)", async () => {
		const res = await app.request(`/orgs/${ORG_ID}/members/${OTHER_USER}`, { method: "DELETE", headers: userHeaders(OTHER_USER) });
		expect(res.status).toBe(401);
	});
});
