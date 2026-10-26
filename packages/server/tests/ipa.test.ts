import { afterAll, beforeEach, describe, expect, test } from "bun:test";
import { Hono } from "hono";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import {
	findIpaEnte,
	formatPa,
	parsePa,
	readIpaFile,
	resolvePa,
	serializeIpaFile,
	toIpaFile,
	type IpaEnte,
} from "../lib/ipa";
import ipaRouter from "../routes/ipa";

const dir = mkdtempSync(path.join(tmpdir(), "ipa-test-"));
const FILE = path.join(dir, "ipa-enti.json");
afterAll(() => {
	rmSync(dir, { recursive: true, force: true });
	delete process.env.IPA_ENTI_FILE;
});

const ENTI: IpaEnte[] = [
	{ code: "x_1", name: "Stazione Appaltante Uno", type: "Stazioni Appaltanti" },
	{ code: "c_a944", name: "Comune di Bologna", type: "Pubbliche Amministrazioni" },
];

beforeEach(async () => {
	process.env.IPA_ENTI_FILE = FILE;
	await Bun.write(FILE, serializeIpaFile(toIpaFile(ENTI, "2026-10-26")));
});

// ─── Value format ───────────────────────────────────────────────────────────

describe("formatPa / parsePa", () => {
	test("round-trips code and name", () => {
		const value = formatPa({ code: "c_a944", name: "Comune di Bologna" });
		expect(value).toBe("c_a944#Comune di Bologna");
		expect(parsePa(value)).toEqual({ code: "c_a944", name: "Comune di Bologna" });
	});

	test("free text saved before IndicePA has no code", () => {
		expect(parsePa("Comune di Bologna")).toEqual({ code: null, name: "Comune di Bologna" });
		expect(parsePa("#Comune")).toEqual({ code: null, name: "#Comune" });
		expect(parsePa("Ufficio n. 3 #2")).toEqual({ code: null, name: "Ufficio n. 3 #2" });
	});
});

// ─── File ───────────────────────────────────────────────────────────────────

describe("data file", () => {
	test("sorted by name, types as indexes, one ente per line", async () => {
		const text = await Bun.file(FILE).text();
		expect(text.split("\n")[1]).toBe('["c_a944","Comune di Bologna",0],');
		const file = await readIpaFile();
		expect(file.types).toEqual(["Pubbliche Amministrazioni", "Stazioni Appaltanti"]);
		expect(file.enti).toEqual([["c_a944", "Comune di Bologna", 0], ["x_1", "Stazione Appaltante Uno", 1]]);
	});

	test("findIpaEnte / resolvePa read it from disk", async () => {
		expect(await findIpaEnte("x_1")).toEqual(ENTI[0]);
		expect(await resolvePa(" c_a944#qualsiasi ")).toBe("c_a944#Comune di Bologna");
		expect(await resolvePa("c_zzzz#Comune")).toBeNull();
		expect(await resolvePa("Comune di Bologna")).toBeNull();
	});

	test("missing file → IpaUnavailableError", async () => {
		process.env.IPA_ENTI_FILE = path.join(dir, "missing.json");
		await expect(resolvePa("c_a944#Comune di Bologna")).rejects.toThrow("not readable");
	});
});

// ─── GET /ipa/enti ──────────────────────────────────────────────────────────

describe("GET /ipa/enti", () => {
	const app = new Hono().route("/ipa", ipaRouter);

	test("200 with the file content, ETag and cache headers", async () => {
		const res = await app.request("/ipa/enti");
		expect(res.status).toBe(200);
		expect(res.headers.get("Cache-Control")).toContain("max-age=3600");
		expect(res.headers.get("ETag")).toBeTruthy();
		expect(await res.json()).toEqual(await readIpaFile());
	});

	test("304 when the ETag matches, also the weak one of a gzipped response", async () => {
		const etag = (await app.request("/ipa/enti")).headers.get("ETag")!;
		expect((await app.request("/ipa/enti", { headers: { "If-None-Match": etag } })).status).toBe(304);
		expect((await app.request("/ipa/enti", { headers: { "If-None-Match": `W/${etag}` } })).status).toBe(304);
	});

	test("503 when the file is missing", async () => {
		process.env.IPA_ENTI_FILE = path.join(dir, "missing.json");
		expect((await app.request("/ipa/enti")).status).toBe(503);
	});
});
