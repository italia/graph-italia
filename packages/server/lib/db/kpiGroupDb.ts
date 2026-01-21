import createDb from "./createDb";
import { prisma } from "./prisma";
import type { Chart, Prisma } from "./prisma/client";

type CreateKpiGroup = {
    name: string;
    description?: string;
    userId: string;
    data: unknown[];
    chart: 'kpiGroup'
}

type UpdateKpiGroup = {
    config: {};
    data: unknown[];
}

type WhereKpiGroup = {}

const kpiGroupDb = createDb<CreateKpiGroup, UpdateKpiGroup, WhereKpiGroup>(prisma.chart);

export async function createKpiGroup(data: CreateKpiGroup) {
    return await kpiGroupDb.create(data);
}

export async function findKpiGroupById(id: string) {
    return kpiGroupDb.findById(id);
}

export async function updateKpiGroup(id: Chart["id"], { config, data }: UpdateKpiGroup) {
    return await kpiGroupDb.update(id,
        {
            config: config as Prisma.JsonObject,
            data: data as Prisma.JsonArray
        });
}

