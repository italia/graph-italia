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
const READWRITE_KEY = `dv_bbbbbbbb_${"b".repeat(64)}`;

const USER_ID = "user-1";
const OTHER_USER = "user-2";
const PROJECT_ID = "proj-1";
const ORG_ID = "org-1";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const MEMBER = { userId: USER_ID, projectId: PROJECT_ID, role: "ADMIN", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };

const PROJECT = {
	id: PROJECT_ID,
	name: "Default Project",
	ownerId: USER_ID,
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
	members: [MEMBER],
	orgs: [],
};

// ─── Mocks ────────────────────────────────────────────────────────────────────

mock.module("../lib/logger", () => ({
	logger: { debug: mock(() => { }), info: mock(() => { }), warn: mock(() => { }), error: mock(() => { }) },
	httpLogger: mock(async (_c: unknown, next: () => Promise<void>) => next()),
	logStartup: mock(() => { }),
}));

mock.module("../lib/db/apiKeyDb", () => ({
	findApiKeyByRawKey: mock(async (key: string) => {
		if (key === READWRITE_KEY) return { id: "key-rw", prefix: "bbbbbbbb", keyHash: "hash_rw", role: "READWRITE", expire: 60, revokedAt: null, projectId: PROJECT_ID, createdAt: new Date(), updatedAt: new Date() };
		return null;
	}),
	revokeApiKey: mock(async () => undefined),
	reinstateApiKey: mock(async () => undefined),
	createApiLog: mock(async () => undefined),
}));

mock.module("../lib/db", () => ({
	default: {
		findProjectsByUserId: mock(async () => [PROJECT]),
		findProjectById: mock(async (id: string) => id === PROJECT_ID ? PROJECT : null),
		createProject: mock(async () => PROJECT),
		updateProject: mock(async (id: string, name: string) => ({ ...PROJECT, id, name })),
		deleteProject: mock(async () => undefined),
		isProjectOwner: mock(async (userId: string, projectId: string) => userId === USER_ID && projectId === PROJECT_ID),
		canUserModifyProject: mock(async (userId: string, projectId: string) => userId === USER_ID && projectId === PROJECT_ID),
		findProjectMembers: mock(async () => [MEMBER]),
		addProjectMember: mock(async (_projectId: string, userId: string) => ({ ...MEMBER, userId })),
		removeProjectMember: mock(async () => undefined),
		updateProjectMemberRole: mock(async (_projectId: string, userId: string, role: string) => ({ ...MEMBER, userId, role })),
		associateOrgWithProject: mock(async () => ({ projectId: PROJECT_ID, orgId: ORG_ID })),
		removeOrgFromProject: mock(async () => undefined),
	},
}));

// ─── App builder ─────────────────────────────────────────────────────────────

async function buildApp() {
	const { default: projectsRouter } = await import("../routes/projects");
	const app = new Hono<{ Variables: TestVariables }>();
	app.route("/projects", projectsRouter);
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

describe("GET /projects — list", () => {
	test("user JWT returns project list", async () => {
		const res = await app.request("/projects", { headers: userHeaders() });
		expect(res.status).toBe(200);
		const body = await res.json() as typeof PROJECT[];
		expect(body).toHaveLength(1);
		expect(body[0]?.id).toBe(PROJECT_ID);
	});

	test("no credentials returns 401", async () => {
		const res = await app.request("/projects");
		expect(res.status).toBe(401);
	});

	test("API key is rejected (requireUser)", async () => {
		const res = await app.request("/projects", { headers: apiKeyHeaders(READWRITE_KEY) });
		expect(res.status).toBe(401);
	});
});

describe("GET /projects/:id — single", () => {
	test("owner returns project (200)", async () => {
		const res = await app.request(`/projects/${PROJECT_ID}`, { headers: userHeaders() });
		expect(res.status).toBe(200);
		const body = await res.json() as typeof PROJECT;
		expect(body.id).toBe(PROJECT_ID);
	});

	test("non-member user is rejected (401)", async () => {
		const res = await app.request(`/projects/${PROJECT_ID}`, { headers: userHeaders(OTHER_USER) });
		expect(res.status).toBe(401);
	});

	test("nonexistent project returns 404", async () => {
		const res = await app.request("/projects/nonexistent", { headers: userHeaders() });
		expect(res.status).toBe(404);
	});

	test("no credentials returns 401", async () => {
		const res = await app.request(`/projects/${PROJECT_ID}`);
		expect(res.status).toBe(401);
	});
});

describe("POST /projects — create", () => {
	test("user JWT creates project (201)", async () => {
		const res = await app.request("/projects", { method: "POST", ...withJson(userHeaders(), { name: "My Project" }) });
		expect(res.status).toBe(201);
	});

	test("no credentials returns 401", async () => {
		const res = await app.request("/projects", { method: "POST", ...withJson({}, { name: "x" }) });
		expect(res.status).toBe(401);
	});
});

describe("PUT /projects/:id — update", () => {
	test("ADMIN user updates project (200)", async () => {
		const res = await app.request(`/projects/${PROJECT_ID}`, { method: "PUT", ...withJson(userHeaders(), { name: "Renamed" }) });
		expect(res.status).toBe(200);
	});

	test("non-admin user is rejected (401)", async () => {
		const res = await app.request(`/projects/${PROJECT_ID}`, { method: "PUT", ...withJson(userHeaders(OTHER_USER), { name: "Hack" }) });
		expect(res.status).toBe(401);
	});

	test("no credentials returns 401", async () => {
		const res = await app.request(`/projects/${PROJECT_ID}`, { method: "PUT", ...withJson({}, { name: "x" }) });
		expect(res.status).toBe(401);
	});
});

describe("DELETE /projects/:id — delete", () => {
	test("owner deletes project (204)", async () => {
		const res = await app.request(`/projects/${PROJECT_ID}`, { method: "DELETE", headers: userHeaders() });
		expect(res.status).toBe(204);
	});

	test("non-owner is rejected (401)", async () => {
		const res = await app.request(`/projects/${PROJECT_ID}`, { method: "DELETE", headers: userHeaders(OTHER_USER) });
		expect(res.status).toBe(401);
	});

	test("no credentials returns 401", async () => {
		const res = await app.request(`/projects/${PROJECT_ID}`, { method: "DELETE" });
		expect(res.status).toBe(401);
	});
});

describe("GET /projects/:id/members — list members", () => {
	test("ADMIN user returns members (200)", async () => {
		const res = await app.request(`/projects/${PROJECT_ID}/members`, { headers: userHeaders() });
		expect(res.status).toBe(200);
		const body = await res.json() as typeof MEMBER[];
		expect(body).toHaveLength(1);
	});

	test("non-admin is rejected (401)", async () => {
		const res = await app.request(`/projects/${PROJECT_ID}/members`, { headers: userHeaders(OTHER_USER) });
		expect(res.status).toBe(401);
	});
});

describe("POST /projects/:id/members — add member", () => {
	test("ADMIN user adds member (201)", async () => {
		const res = await app.request(`/projects/${PROJECT_ID}/members`, { method: "POST", ...withJson(userHeaders(), { userId: OTHER_USER, role: "USER" }) });
		expect(res.status).toBe(201);
	});

	test("non-admin is rejected (401)", async () => {
		const res = await app.request(`/projects/${PROJECT_ID}/members`, { method: "POST", ...withJson(userHeaders(OTHER_USER), { userId: "user-3", role: "USER" }) });
		expect(res.status).toBe(401);
	});
});

describe("PUT /projects/:id/members/:userId — update member role", () => {
	test("ADMIN user updates role (200)", async () => {
		const res = await app.request(`/projects/${PROJECT_ID}/members/${OTHER_USER}`, { method: "PUT", ...withJson(userHeaders(), { role: "ADMIN" }) });
		expect(res.status).toBe(200);
	});

	test("non-admin is rejected (401)", async () => {
		const res = await app.request(`/projects/${PROJECT_ID}/members/${OTHER_USER}`, { method: "PUT", ...withJson(userHeaders(OTHER_USER), { role: "ADMIN" }) });
		expect(res.status).toBe(401);
	});
});

describe("DELETE /projects/:id/members/:userId — remove member", () => {
	test("ADMIN user removes member (204)", async () => {
		const res = await app.request(`/projects/${PROJECT_ID}/members/${OTHER_USER}`, { method: "DELETE", headers: userHeaders() });
		expect(res.status).toBe(204);
	});

	test("non-admin is rejected (401)", async () => {
		const res = await app.request(`/projects/${PROJECT_ID}/members/${OTHER_USER}`, { method: "DELETE", headers: userHeaders(OTHER_USER) });
		expect(res.status).toBe(401);
	});
});

describe("POST /projects/:id/orgs — associate org", () => {
	test("ADMIN user associates org (201)", async () => {
		const res = await app.request(`/projects/${PROJECT_ID}/orgs`, { method: "POST", ...withJson(userHeaders(), { orgId: ORG_ID }) });
		expect(res.status).toBe(201);
	});

	test("non-admin is rejected (401)", async () => {
		const res = await app.request(`/projects/${PROJECT_ID}/orgs`, { method: "POST", ...withJson(userHeaders(OTHER_USER), { orgId: ORG_ID }) });
		expect(res.status).toBe(401);
	});
});

describe("DELETE /projects/:id/orgs/:orgId — remove org", () => {
	test("owner removes org association (204)", async () => {
		const res = await app.request(`/projects/${PROJECT_ID}/orgs/${ORG_ID}`, { method: "DELETE", headers: userHeaders() });
		expect(res.status).toBe(204);
	});

	test("non-owner is rejected (401)", async () => {
		const res = await app.request(`/projects/${PROJECT_ID}/orgs/${ORG_ID}`, { method: "DELETE", headers: userHeaders(OTHER_USER) });
		expect(res.status).toBe(401);
	});
});
