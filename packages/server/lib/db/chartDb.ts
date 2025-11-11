import type { Chart, User } from '@prisma/client';
import { Prisma, PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export function findChartById(id: Chart['id']) {
  return prisma.chart.findUnique({
    where: {
      id,
    },
  });
}

export function findChartsByUSerId(id: User['id']) {
  return prisma.chart.findMany({
    where: {
      userId: id,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });
}

export function createChart(data: Prisma.ChartCreateInput) {
  return prisma.chart.create({ data });
}

export function publishChart(id: Chart['id'], publish: boolean) {
  return prisma.chart.update({
    where: {
      id,
    },
    data: {
      publish,
    },
  });
}

export function updateChart(id: Chart['id'], data: Prisma.ChartUpdateInput) {
  return prisma.chart.update({
    where: {
      id,
    },
    data,
  });
}

export function deleteChart(id: Chart['id']) {
  return prisma.chart.delete({
    where: {
      id,
    },
  });
}
