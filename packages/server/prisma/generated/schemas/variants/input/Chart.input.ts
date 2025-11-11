import * as z from 'zod';

// prettier-ignore
export const ChartInputSchema = z.object({
    id: z.string(),
    name: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    chart: z.string(),
    config: z.unknown().optional().nullable(),
    data: z.unknown().optional().nullable(),
    publish: z.boolean(),
    remoteUrl: z.string().optional().nullable(),
    isRemote: z.boolean(),
    preview: z.string().optional().nullable(),
    user: z.unknown(),
    userId: z.string(),
    slot: z.array(z.unknown()),
    createdAt: z.date(),
    updatedAt: z.date(),
    SourceLink: z.array(z.unknown())
}).strict();

export type ChartInputType = z.infer<typeof ChartInputSchema>;
