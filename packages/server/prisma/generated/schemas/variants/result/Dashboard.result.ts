import * as z from 'zod';

// prettier-ignore
export const DashboardResultSchema = z.object({
    id: z.string(),
    name: z.string().nullable(),
    description: z.string().nullable(),
    publish: z.boolean(),
    user: z.unknown(),
    userId: z.string(),
    slots: z.array(z.unknown()),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type DashboardResultType = z.infer<typeof DashboardResultSchema>;
