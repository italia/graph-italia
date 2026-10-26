import { afterAll, beforeEach, describe, expect, mock, test } from "bun:test";
import { Hono } from "hono";
import { sign, verify } from "jsonwebtoken";

// ─── Constants ────────────────────────────────────────────────────────────────

const OSCAR_KEY = "oscar-test-key";
const OSCAR_URL = "https://oscar.test/verifications";
const USER_ID = "user-1";
const PA = { code: "c_a944", name: "Comune di Bologna" };
const REQUEST = { userId: USER_ID, firstName: "Mario", lastName: "Rossi", pa: PA };

// ─── Mocks ────────────────────────────────────────────────────────────────────

mock.module("../lib/logger", () => ({
	logger: { debug: mock(() => {}), info: mock(() => {}), warn: mock(() => {}), error: mock(() => {}) },
}));

const setPaVerified = mock(async (_id: string, _state: number | null) => ({}));
const clearPendingPaVerification = mock(async (_id: string) => ({ count: 1 }));
const findUserById = mock(async (id: string) =>
	id === USER_ID ? { id: USER_ID, email: "mario@test.it", pa: `${PA.code}#${PA.name}`, paVerified: 0 } : null,
);
mock.module("../lib/db", () => ({
	default: { setPaVerified, clearPendingPaVerification, findUserById },
}));

const fetchMock = mock(async (_url: string | URL, _init?: RequestInit) => new Response(null, { status: 202 }));
const originalFetch = globalThis.fetch;
globalThis.fetch = fetchMock as unknown as typeof fetch;

const { isValidOscarCallbackToken, requestPaVerification, signOscarRequestToken } = await import("../lib/oscar");
const { default: oscarRouter } = await import("../routes/oscar");
const app = new Hono().route("/oscar", oscarRouter);

const ENV_KEYS = ["ENABLE_OSCAR_PA_VERIFICATION", "OSCAR_URL", "OSCAR_KEY"] as const;
beforeEach(() => {
	process.env.ENABLE_OSCAR_PA_VERIFICATION = "true";
	process.env.OSCAR_URL = OSCAR_URL;
	process.env.OSCAR_KEY = OSCAR_KEY;
	for (const m of [setPaVerified, clearPendingPaVerification, findUserById, fetchMock]) m.mockClear();
	fetchMock.mockImplementation(async () => new Response(null, { status: 202 }));
});
afterAll(() => {
	globalThis.fetch = originalFetch;
	for (const k of ENV_KEYS) delete process.env[k];
});

// Bearer as Oscar would sign it for its callback.
const oscarToken = (opts: { key?: string; issuer?: string; audience?: string; expiresIn?: number } = {}) =>
	sign({}, opts.key ?? OSCAR_KEY, {
		algorithm: "HS256",
		issuer: opts.issuer ?? "oscar",
		audience: opts.audience ?? "graph-italia",
		expiresIn: opts.expiresIn ?? 300,
	});

// ─── Tokens ───────────────────────────────────────────────────────────────────

describe("bearer tokens", () => {
	test("our token: HS256, iss graph-italia, aud oscar, expires within 5 minutes", () => {
		const payload = verify(signOscarRequestToken(OSCAR_KEY), OSCAR_KEY, {
			algorithms: ["HS256"],
			issuer: "graph-italia",
			audience: "oscar",
		}) as { exp: number; iat: number };
		expect(payload.exp - payload.iat).toBe(300);
	});

	test("callback token: only Oscar-signed, unexpired, with our key", () => {
		expect(isValidOscarCallbackToken(oscarToken(), OSCAR_KEY)).toBe(true);
		expect(isValidOscarCallbackToken(oscarToken({ key: "other" }), OSCAR_KEY)).toBe(false);
		expect(isValidOscarCallbackToken(oscarToken({ expiresIn: -10 }), OSCAR_KEY)).toBe(false);
		// Our own outgoing token must not be accepted back (wrong iss/aud).
		expect(isValidOscarCallbackToken(signOscarRequestToken(OSCAR_KEY), OSCAR_KEY)).toBe(false);
		expect(isValidOscarCallbackToken(oscarToken(), "")).toBe(false);
	});
});

// ─── Outgoing request ─────────────────────────────────────────────────────────

describe("requestPaVerification", () => {
	test("sets pending, then POSTs the payload with a signed bearer", async () => {
		await requestPaVerification(REQUEST);
		expect(setPaVerified).toHaveBeenCalledWith(USER_ID, 0);
		const [url, init] = fetchMock.mock.calls[0]!;
		expect(String(url)).toBe(OSCAR_URL);
		expect(init?.method).toBe("POST");
		expect(JSON.parse(String(init?.body))).toEqual(REQUEST);
		const bearer = (init?.headers as Record<string, string>).Authorization.replace("Bearer ", "");
		expect(() => verify(bearer, OSCAR_KEY, { issuer: "graph-italia", audience: "oscar" })).not.toThrow();
		expect(clearPendingPaVerification).not.toHaveBeenCalled();
	});

	test("Oscar error → back to «never requested», no throw", async () => {
		fetchMock.mockImplementation(async () => new Response("boom", { status: 500 }));
		await requestPaVerification(REQUEST);
		expect(clearPendingPaVerification).toHaveBeenCalledWith(USER_ID);
	});

	test("feature off → nothing happens", async () => {
		process.env.ENABLE_OSCAR_PA_VERIFICATION = "false";
		await requestPaVerification(REQUEST);
		expect(fetchMock).not.toHaveBeenCalled();
		expect(setPaVerified).not.toHaveBeenCalled();
	});

	test("enabled without OSCAR_URL/OSCAR_KEY → nothing sent", async () => {
		delete process.env.OSCAR_KEY;
		await requestPaVerification(REQUEST);
		expect(fetchMock).not.toHaveBeenCalled();
		expect(setPaVerified).not.toHaveBeenCalled();
	});
});

// ─── Callback ─────────────────────────────────────────────────────────────────

describe("POST /oscar/pa-verification", () => {
	const callback = (body: object, token: string | null = oscarToken()) =>
		app.request("/oscar/pa-verification", {
			method: "POST",
			headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
			body: JSON.stringify(body),
		});

	test("verified → pa_verified 1", async () => {
		const res = await callback({ ...REQUEST, verified: true });
		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({ paVerified: 1 });
		expect(setPaVerified).toHaveBeenCalledWith(USER_ID, 1);
	});

	test("not a member → pa_verified 2", async () => {
		const res = await callback({ ...REQUEST, verified: false });
		expect(res.status).toBe(200);
		expect(setPaVerified).toHaveBeenCalledWith(USER_ID, 2);
	});

	test("missing or invalid bearer → 401", async () => {
		expect((await callback({ ...REQUEST, verified: true }, null)).status).toBe(401);
		expect((await callback({ ...REQUEST, verified: true }, oscarToken({ key: "other" }))).status).toBe(401);
		expect((await callback({ ...REQUEST, verified: true }, signOscarRequestToken(OSCAR_KEY))).status).toBe(401);
		expect(setPaVerified).not.toHaveBeenCalled();
	});

	test("unknown user → 404; PA changed since the request → 409", async () => {
		expect((await callback({ ...REQUEST, userId: "nobody", verified: true })).status).toBe(404);
		expect((await callback({ ...REQUEST, pa: { code: "c_h501", name: "Roma Capitale" }, verified: true })).status).toBe(409);
		expect(setPaVerified).not.toHaveBeenCalled();
	});

	test("invalid payload → 400", async () => {
		expect((await callback({ ...REQUEST })).status).toBe(400);
	});

	test("feature off → 404, even with a valid bearer", async () => {
		process.env.ENABLE_OSCAR_PA_VERIFICATION = "false";
		expect((await callback({ ...REQUEST, verified: true })).status).toBe(404);
	});
});
