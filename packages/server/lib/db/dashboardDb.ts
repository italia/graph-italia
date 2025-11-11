import type { Dashboard } from '@prisma/client';
import { Prisma, PrismaClient } from '@prisma/client';
import createDb from './createDb';

export const prisma = new PrismaClient();

/**  Dashboards */

export const dashboardDb = createDb(prisma.dashboard);

export async function findDashboardByUserId(userId: string) {
  return prisma.dashboard.findMany({
    where: {
      userId,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });
}

export async function findDashboardByIdWithIncludes(id: Dashboard['id']) {
  return dashboardDb.findById(id, {
    include: { slots: { include: { chart: true } } },
  });
}

export function findSlots(id: Dashboard['id']) {
  return prisma.dashboard.findUnique({
    where: {
      id,
    },
    include: { slots: true },
  });
}

type SlotsPayload = {
  dashboardId: string;
  chartId: string;
  settings: Prisma.JsonValue | null;
  createdAt: Date;
  updatedAt: Date;
}[];

export async function updateSlots(
  dashboardId: Dashboard['id'],
  {
    toCreate,
    toUpdate,
    toDelete,
  }: {
    toCreate: SlotsPayload;
    toUpdate: SlotsPayload;
    toDelete: SlotsPayload;
  }
) {
  //TODO: this method will be refactored

  const deletes = prisma.slot.deleteMany({
    where: {
      dashboardId,
    },
  });

  const creates = prisma.slot.createMany({
    data: [...toCreate, ...toUpdate].map((i) => ({
      ...i,
      dashboardId,
      settings: i.settings as Prisma.InputJsonValue,
    })),
  });

  return await prisma
    .$transaction([deletes, creates])
    .then(([deleteCount, createCount]) => ({
      delete: deleteCount,
      create: createCount,
    }))
    .catch((r) => console.log('transaction', r));
}

export async function deleteDashboardById(id: Dashboard['id']) {
  const slotModel = prisma.slot;
  const dashboardModel = prisma.dashboard;
  const deleteSlots = slotModel.deleteMany({ where: { dashboardId: id } });
  const deleteDashboard = dashboardModel.delete({ where: { id } });

  return await prisma
    .$transaction([deleteSlots, deleteDashboard])
    .then(() => true)
    .catch((e) => {
      console.error('Dashboard delete failed');
      throw e;
    });
}

export function separateCreateAndUpdateSlots<T>(
  storedSlots: Array<T>,
  updatedSlots: Array<T>,
  identityFn: (item: T) => string
): { toCreate: Array<T>; toUpdate: Array<T> } {
  const storedMap = new Map(
    storedSlots.map((slot) => [identityFn(slot), slot])
  );

  const toCreate: Array<T> = [];
  const toUpdate: Array<T> = [];

  for (const slot of updatedSlots) {
    if (storedMap.has(identityFn(slot))) {
      toUpdate.push(slot); // Exists in stored → Needs update
    } else {
      toCreate.push(slot); // New slot → Needs creation
    }
  }

  return { toCreate, toUpdate };
}

export function separateCreateUpdateDeleteSlots<T>(
  storedSlots: Array<T>,
  updatedSlots: Array<T>,
  identityFn: (item: T) => string
): { toCreate: Array<T>; toUpdate: Array<T>; toDelete: Array<T> } {
  const storedMap = new Map(
    storedSlots.map((slot) => [identityFn(slot), slot])
  );
  const updatedMap = new Map(
    updatedSlots.map((slot) => [identityFn(slot), slot])
  );

  const toCreate: Array<T> = [];
  const toUpdate: Array<T> = [];
  const toDelete: Array<T> = [];

  for (const slot of updatedSlots) {
    if (storedMap.has(identityFn(slot))) {
      toUpdate.push(slot); // Exists in both → Needs update
    } else {
      toCreate.push(slot); // Only in updatedSlots → Needs creation
    }
  }

  for (const slot of storedSlots) {
    if (!updatedMap.has(identityFn(slot))) {
      toDelete.push(slot); // Only in storedSlots → Needs deletion
    }
  }

  return { toCreate, toUpdate, toDelete };
}
