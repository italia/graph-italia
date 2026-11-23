import { beforeEach, describe, expect, mock, test } from "bun:test";

// In-memory stand-in for the Prisma transaction client: records what the
// duplicate helpers write, so the copy rules can be checked without a DB.
const created = {
	chart: [] as Record<string, unknown>[],
	sourceLink: [] as Record<string, unknown>[],
	dashboard: [] as Record<string, unknown>[],
	slot: [] as Record<string, unknown>[],
};

const TEXT_CHART = {
	id: "text-1", projectId: "p1", name: "dashboard-text-a", description: "", chart: "text",
	config: { content: "# Intro" }, data: null, dataSource: null, remoteUrl: null, isRemote: false, publish: true,
};
const BAR_CHART = {
	id: "bar-1", projectId: "p1", name: "Bar", description: "Alt text", chart: "bar",
	config: { palette: "x" }, data: [["a", 1]], dataSource: null, remoteUrl: "https://example.org/data.csv",
	isRemote: true, publish: true,
	sourceLink: [{ dataSourceId: "ds-1", chartId: "bar-1", config: null }],
};
const DASHBOARD = {
	id: "dash-1", projectId: "p1", name: "Dash", description: "Desc", publish: true,
	slots: [
		{ dashboardId: "dash-1", chartId: "bar-1", settings: { i: "s1", w: 4 }, name: null, description: "", chart: BAR_CHART },
		{ dashboardId: "dash-1", chartId: "text-1", settings: { i: "s2", w: 12 }, name: null, description: "", chart: TEXT_CHART },
	],
};

let nextId = 0;
const tx = {
	chart: {
		findUnique: mock(async ({ where }: { where: { id: string } }) => (where.id === BAR_CHART.id ? BAR_CHART : null)),
		create: mock(async ({ data }: { data: Record<string, unknown> }) => {
			const row = { ...data, id: `chart-copy-${++nextId}` };
			created.chart.push(row);
			return row;
		}),
	},
	sourceLink: {
		createMany: mock(async ({ data }: { data: Record<string, unknown>[] }) => {
			created.sourceLink.push(...data);
			return { count: data.length };
		}),
	},
	dashboard: {
		findUnique: mock(async ({ where }: { where: { id: string } }) => (where.id === DASHBOARD.id ? DASHBOARD : null)),
		create: mock(async ({ data }: { data: Record<string, unknown> }) => {
			const row = { ...data, id: "dash-copy" };
			created.dashboard.push(row);
			return row;
		}),
	},
	slot: {
		create: mock(async ({ data }: { data: Record<string, unknown> }) => {
			created.slot.push(data);
			return data;
		}),
	},
};

mock.module("../lib/db/prisma", () => ({
	prisma: { $transaction: async (fn: (t: typeof tx) => unknown) => fn(tx) },
}));

const { duplicateChart, duplicateDashboard } = await import("../lib/db/duplicateDb");
const { Prisma } = await import("../lib/db/prisma/client");

beforeEach(() => {
	for (const list of Object.values(created)) list.length = 0;
	nextId = 0;
});

describe("duplicateChart", () => {
	test("copies every field with the new name and links the same data sources", async () => {
		const copy = await duplicateChart("bar-1", { name: "Bar copy 2026-11-23 16:10:05", publish: false });
		expect(copy?.id).toBe("chart-copy-1");
		expect(created.chart[0]).toEqual({
			projectId: "p1",
			name: "Bar copy 2026-11-23 16:10:05",
			description: "Alt text",
			chart: "bar",
			config: { palette: "x" },
			data: [["a", 1]],
			dataSource: Prisma.DbNull,
			remoteUrl: "https://example.org/data.csv",
			isRemote: true,
			publish: false,
			id: "chart-copy-1",
		});
		expect(created.sourceLink).toEqual([{ dataSourceId: "ds-1", chartId: "chart-copy-1", config: Prisma.DbNull }]);
	});

	test("unknown chart → null, nothing written", async () => {
		expect(await duplicateChart("nope", { name: "x", publish: false })).toBeNull();
		expect(created.chart).toHaveLength(0);
	});
});

describe("duplicateDashboard", () => {
	test("same layout: charts shared, text blocks copied", async () => {
		const copy = await duplicateDashboard("dash-1", { name: "Dash copy 2026-11-23 16:10:05", publish: false });
		expect(copy?.id).toBe("dash-copy");
		expect(created.dashboard[0]).toMatchObject({
			projectId: "p1", name: "Dash copy 2026-11-23 16:10:05", description: "Desc", publish: false,
		});

		// Only the text block got a new chart, with the dashboard copy's publish value.
		expect(created.chart).toHaveLength(1);
		expect(created.chart[0]).toMatchObject({ chart: "text", config: { content: "# Intro" }, publish: false });

		expect(created.slot).toEqual([
			{ dashboardId: "dash-copy", chartId: "bar-1", settings: { i: "s1", w: 4 }, name: null, description: "" },
			{ dashboardId: "dash-copy", chartId: "chart-copy-1", settings: { i: "s2", w: 12 }, name: null, description: "" },
		]);
	});

	test("unknown dashboard → null", async () => {
		expect(await duplicateDashboard("nope", { name: "x", publish: false })).toBeNull();
		expect(created.dashboard).toHaveLength(0);
	});
});
