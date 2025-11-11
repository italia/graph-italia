import * as z from 'zod';

// prettier-ignore
export const SlotModelSchema = z.object({
    dashboard: z.unknown(),
    dashboardId: z.string(),
    chart: z.unknown(),
    chartId: z.string(),
    settings: z.unknown().nullable(),
    name: z.string().nullable(),
    description: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type SlotPureType = z.infer<typeof SlotModelSchema>;
