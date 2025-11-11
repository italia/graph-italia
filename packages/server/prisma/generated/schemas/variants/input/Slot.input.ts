import * as z from 'zod';

// prettier-ignore
export const SlotInputSchema = z.object({
    dashboard: z.unknown(),
    dashboardId: z.string(),
    chart: z.unknown(),
    chartId: z.string(),
    settings: z.unknown().optional().nullable(),
    name: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type SlotInputType = z.infer<typeof SlotInputSchema>;
