import { Prisma } from "./prisma/client";
import type { Chart, Dashboard } from "./prisma/client";
import { prisma } from "./prisma";

// Copying a Json column: a SQL NULL has to be written back as DbNull.
const json = (value: Prisma.JsonValue | null) =>
	value === null ? Prisma.DbNull : (value as Prisma.InputJsonValue);

type Tx = Prisma.TransactionClient;

/** Copy of `source` in the same project, with its data source links. */
function copyChart(tx: Tx, source: Chart, overrides: { name?: string | null; publish: boolean }) {
	return tx.chart.create({
		data: {
			projectId: source.projectId,
			name: overrides.name === undefined ? source.name : overrides.name,
			description: source.description,
			chart: source.chart,
			config: json(source.config),
			data: json(source.data),
			dataSource: json(source.dataSource),
			remoteUrl: source.remoteUrl,
			isRemote: source.isRemote,
			publish: overrides.publish,
		},
	});
}

/**
 * Duplicates a chart (any type: chart, map, KPI group) in its own project,
 * links to data sources included. `publish` is decided by the caller, which
 * applies the instance publishing policy.
 */
export async function duplicateChart(id: Chart["id"], { name, publish }: { name: string; publish: boolean }) {
	return prisma.$transaction(async (tx) => {
		const source = await tx.chart.findUnique({ where: { id }, include: { sourceLink: true } });
		if (!source) return null;
		const copy = await copyChart(tx, source, { name, publish });
		if (source.sourceLink.length > 0) {
			await tx.sourceLink.createMany({
				data: source.sourceLink.map((link) => ({
					dataSourceId: link.dataSourceId,
					chartId: copy.id,
					config: json(link.config),
				})),
			});
		}
		return copy;
	});
}

/**
 * Duplicates a dashboard with its layout. Slots keep pointing to the same
 * charts, as when a chart is added to a dashboard; text blocks are hidden
 * charts of type "text" owned by their dashboard, so they are copied too —
 * editing the copy's texts must not change the original — and, like the
 * webapp does when saving, follow the dashboard's publish value.
 */
export async function duplicateDashboard(
	id: Dashboard["id"],
	{ name, publish }: { name: string; publish: boolean },
) {
	return prisma.$transaction(async (tx) => {
		const source = await tx.dashboard.findUnique({
			where: { id },
			include: { slots: { include: { chart: true } } },
		});
		if (!source) return null;

		const copy = await tx.dashboard.create({
			data: {
				projectId: source.projectId,
				name,
				description: source.description,
				publish,
			},
		});

		for (const slot of source.slots) {
			const chartId = slot.chart.chart === "text"
				? (await copyChart(tx, slot.chart, { publish })).id
				: slot.chartId;
			await tx.slot.create({
				data: {
					dashboardId: copy.id,
					chartId,
					settings: json(slot.settings),
					name: slot.name,
					description: slot.description,
				},
			});
		}
		return copy;
	});
}
