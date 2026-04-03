import { prisma } from "./prisma";
import type { Chart, Prisma } from "./prisma/client";

export function findChartById(id: Chart["id"]) {
  return prisma.chart.findUnique({ where: { id } });
}

export function findChartsByProjectId(projectId: string) {
  return prisma.chart.findMany({
    where: { projectId },
    orderBy: { updatedAt: "desc" },
  });
}

export function createChart(data: Prisma.ChartUncheckedCreateInput) {
  return prisma.chart.create({ data });
}

export function publishChart(id: Chart["id"], publish: boolean) {
  return prisma.chart.update({ where: { id }, data: { publish } });
}

export function updateChart(id: Chart["id"], data: Prisma.ChartUpdateInput) {
  return prisma.chart.update({ where: { id }, data });
}

export function deleteChart(id: Chart["id"]) {
  return prisma.chart.delete({ where: { id } });
}
