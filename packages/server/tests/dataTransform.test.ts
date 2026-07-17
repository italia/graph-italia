import { describe, expect, test } from "bun:test";
import { applyDataTransform, isDataTransform, type Matrix } from "../lib/dataTransform";

const RAW: Matrix = [
	["regione", "ente", "importo", "codice"],
	["Sicilia", "Comune A", "100.5", "9"],
	["Lazio", "Comune B", "50", "7"],
	["Sicilia", "Comune C", "10", "5"],
];

describe("isDataTransform", () => {
	test("accepts a valid recipe and rejects garbage", () => {
		expect(isDataTransform({ version: 1, category: "regione", series: ["importo"] })).toBe(true);
		expect(isDataTransform(null)).toBe(false);
		expect(isDataTransform({ version: 2, category: "x", series: [] })).toBe(false);
		expect(isDataTransform({ version: 1, category: "x", series: [1] })).toBe(false);
	});
});

describe("applyDataTransform", () => {
	test("column selection without aggregation", () => {
		const out = applyDataTransform(RAW, {
			version: 1,
			category: "regione",
			series: ["importo"],
		});
		expect(out).toEqual([
			["regione", "importo"],
			["Sicilia", 100.5],
			["Lazio", 50],
			["Sicilia", 10],
		]);
	});

	test("count aggregation uses the saved column label", () => {
		const out = applyDataTransform(RAW, {
			version: 1,
			category: "regione",
			series: ["conteggio"],
			aggregation: { fn: "count", countLabel: "conteggio" },
		});
		expect(out).toEqual([
			["regione", "conteggio"],
			["Sicilia", 2],
			["Lazio", 1],
		]);
	});

	test("sum aggregation over numeric columns, rounded to 2 decimals", () => {
		const out = applyDataTransform(RAW, {
			version: 1,
			category: "regione",
			series: ["importo"],
			aggregation: { fn: "sum" },
		});
		expect(out).toEqual([
			["regione", "importo"],
			["Sicilia", 110.5],
			["Lazio", 50],
		]);
	});

	test("mean aggregation", () => {
		const out = applyDataTransform(RAW, {
			version: 1,
			category: "regione",
			series: ["importo"],
			aggregation: { fn: "mean" },
		});
		expect(out).toEqual([
			["regione", "importo"],
			["Sicilia", 55.25],
			["Lazio", 50],
		]);
	});

	test("returns null when the category column disappeared", () => {
		const out = applyDataTransform(RAW, {
			version: 1,
			category: "provincia",
			series: ["importo"],
		});
		expect(out).toBeNull();
	});

	test("returns null when a series column disappeared", () => {
		const out = applyDataTransform(RAW, {
			version: 1,
			category: "regione",
			series: ["importo", "spesa"],
		});
		expect(out).toBeNull();
	});

	test("returns null on empty or headers-only data", () => {
		const recipe = { version: 1, category: "regione", series: ["importo"] } as const;
		expect(applyDataTransform([], recipe)).toBeNull();
		expect(applyDataTransform([["regione", "importo"]], recipe)).toBeNull();
	});
});
