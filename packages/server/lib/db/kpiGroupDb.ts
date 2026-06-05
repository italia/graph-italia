import createDb from "./createDb";
import { prisma } from "./prisma";
import type { Chart, Prisma } from "./prisma/client";

type CreateKpiGroup = {
    name: string;
    description?: string;
    projectId: string;
    config: {};
    data: unknown[];
    chart: 'kpiGroup'
}

type UpdateKpiGroup = {
    name: string;
    description?: string;
    publish?: boolean;
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

export async function updateKpiGroup(id: Chart["id"], { name, description, publish, config, data }: UpdateKpiGroup) {
    return await kpiGroupDb.update(id,
        {
            name,
            description,
            publish,
            config: config as Prisma.JsonObject,
            data: data as Prisma.JsonArray
        });
}

