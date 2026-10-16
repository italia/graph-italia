import { beforeAll, beforeEach, describe, expect, mock, test } from "bun:test";
import { Hono } from "hono";
import { sign } from "jsonwebtoken";

// ─── Constants ────────────────────────────────────────────────────────────────

const JWT_SECRET = "test-secret";
process.env["JWT_SECRET"] = JWT_SECRET;

const ADMIN_ID = "admin-1";
const USER_ID = "user-1";
const OTHER_ADMIN_ID = "admin-2";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const baseUser = { password: "hashed", verified: true, pa: null, createdAt: new Date(), updatedAt: new Date() };
const USERS: Record<string, { id: string; email: string; role: string }> = {
	[ADMIN_ID]: { ...baseUser, id: ADMIN_ID, email: "admin@test.com", role: "ADMIN" },
	[USER_ID]: { ...baseUser, id: USER_ID, email: "user@test.com", role: "USER" },
	[OTHER_ADMIN_ID]: { ...baseUser, id: OTHER_ADMIN_ID, email: "admin2@test.com", role: "ADMIN" },
};

let adminCount = 2;

// ─── Mocks ────────────────────────────────────────────────────────────────────

mock.module("../lib/logger", () => ({
	logger: { debug: mock(() => {}), info: mock(() => {}), warn: mock(() => {}), error: mock(() => {}) },
	httpLogger: mock(async (_c: unknown, next: () => Promise<void>) => next()),
	logStartup: mock(() => {}),
}));

mock.module("../lib/db/apiKeyDb", () => ({
	findApiKeyByRawKey: mock(async () => null),
	revokeApiKey: mock(async () => undefined),
	reinstateApiKey: mock(async () => undefined),
	createApiLog: mock(async () => undefined),
}));

mock.module("../lib/email", () => ({
	sendActivationEmail: mock(async () => {}),
	sendResetPasswordEmail: mock(async () => {}),
	sendOidcEmailCode: mock(async () => {}),
}));

const setUserRole = mock(async (id: string, role: string) => ({ ...USERS[id], role }));

mock.module("../lib/db", () => ({
	default: {
		findUserById: mock(async (id: string) => USERS[id] ?? null),
		countAdmins: mock(async () => adminCount),
		setUserRole,
	},
}));

// ─── App builder ─────────────────────────────────────────────────────────────

async function buildApp() {
	const { default: adminRouter } = await import("../routes/admin");
	const app = new Hono();
	app.route("/admin", adminRouter);
	return app;
}

function asUser(userId: string, role: "USER" | "ADMIN") {
	const token = sign({ userId, name: USERS[userId]!.email, role }, JWT_SECRET, { expiresIn: "1h" });
	return { Authorization: `Bearer ${token}` };
}

function patchRole(id: string, role: string, headers = asUser(ADMIN_ID, "ADMIN")) {
	return app.request(`/admin/users/${id}/role`, {
		method: "PATCH",
		headers: { ...headers, "Content-Type": "application/json" },
		body: JSON.stringify({ role }),
	});
}

let app: Hono;
beforeAll(async () => { app = await buildApp(); });
beforeEach(() => {
	adminCount = 2;
	setUserRole.mockClear();
});

// ─── PATCH /admin/users/:id/role ─────────────────────────────────────────────

describe("PATCH /admin/users/:id/role", () => {
	test("promotes a user → 200", async () => {
		const res = await patchRole(USER_ID, "ADMIN");
		expect(res.status).toBe(200);
		expect(setUserRole).toHaveBeenCalledWith(USER_ID, "ADMIN");
	});

	test("demotes another admin → 200", async () => {
		const res = await patchRole(OTHER_ADMIN_ID, "USER");
		expect(res.status).toBe(200);
		expect(setUserRole).toHaveBeenCalledWith(OTHER_ADMIN_ID, "USER");
	});

	test("own role → 400", async () => {
		const res = await patchRole(ADMIN_ID, "USER");
		expect(res.status).toBe(400);
		expect(setUserRole).not.toHaveBeenCalled();
	});

	test("demoting the last admin → 400", async () => {
		adminCount = 1;
		const res = await patchRole(OTHER_ADMIN_ID, "USER");
		expect(res.status).toBe(400);
		expect(setUserRole).not.toHaveBeenCalled();
	});

	test("invalid role → 400", async () => {
		const res = await patchRole(USER_ID, "ROOT");
		expect(res.status).toBe(400);
	});

	test("unknown user → 404", async () => {
		const res = await patchRole("nobody", "ADMIN");
		expect(res.status).toBe(404);
	});

	test("non-admin caller → 403", async () => {
		const res = await patchRole(OTHER_ADMIN_ID, "USER", asUser(USER_ID, "USER"));
		expect(res.status).toBe(403);
	});
});
