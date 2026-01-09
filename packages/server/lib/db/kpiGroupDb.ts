import createDb from "./createDb";
import { prisma } from "./prisma";

type CreateKpiGroup = {
    name: string;
    description?: string;
    userId: string;
    chart: 'kpiGroup'
}

type UpdateKpiGroup = {
    name: string;
    description?: string;
}

type WhereKpiGroup = {}

const kpiGroupDb = createDb<CreateKpiGroup, UpdateKpiGroup, WhereKpiGroup>(prisma.chart);

export async function createKpiGroup(data: CreateKpiGroup) {
    return kpiGroupDb.create(data);
}

export async function findKpiGroupById(id: string) {
    return kpiGroupDb.findById(id);
}
