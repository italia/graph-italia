import { prisma } from "./prisma";
import { type DataSource, Prisma } from "./prisma/client";


export function findDataSourceById(id: DataSource["id"]) {
  return prisma.dataSource.findUnique({ where: { id } });
}

export function findDataSourcesByProjectId(projectId: string) {
  return prisma.dataSource.findMany({
    where: { projectId },
    orderBy: { updatedAt: "desc" },
  });
}

export function createDataSource(data: Prisma.DataSourceUncheckedCreateInput) {

  return prisma.dataSource.create({ data });
}

export function updateDataSource(id: DataSource["id"], data: Prisma.DataSourceUpdateInput) {
  return prisma.dataSource.update({ where: { id }, data });
}

export function deleteDataSource(id: DataSource["id"]) {
  return prisma.dataSource.delete({ where: { id } });
}

// ─── SourceLink ───────────────────────────────────────────────────────────────

export function findSourceLinksByDataSource(dataSourceId: string) {
  return prisma.sourceLink.findMany({
    where: { dataSourceId },
    include: { chart: true },
  });
}

export function createSourceLink(dataSourceId: string, chartId: string, config?: unknown) {
  return prisma.sourceLink.create({
    data: {
      dataSourceId,
      chartId,
      config: config as Prisma.InputJsonValue ?? Prisma.JsonNull,
    },
  });
}

export function deleteSourceLink(dataSourceId: string, chartId: string) {
  return prisma.sourceLink.delete({
    where: { dataSourceId_chartId: { dataSourceId, chartId } },
  });
}
