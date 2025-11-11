import * as z from 'zod';

// prettier-ignore
export const DashboardInputSchema = z.object({
    id: z.string(),
    name: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    publish: z.boolean(),
    user: z.unknown(),
    userId: z.string(),
    slots: z.array(z.unknown()),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type DashboardInputType = z.infer<typeof DashboardInputSchema>;
