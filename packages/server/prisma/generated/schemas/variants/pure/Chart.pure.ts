import * as z from 'zod';

// prettier-ignore
export const ChartModelSchema = z.object({
    id: z.string(),
    name: z.string().nullable(),
    description: z.string().nullable(),
    chart: z.string(),
    config: z.unknown().nullable(),
    data: z.unknown().nullable(),
    publish: z.boolean(),
    remoteUrl: z.string().nullable(),
    isRemote: z.boolean(),
    preview: z.string().nullable(),
    user: z.unknown(),
    userId: z.string(),
    slot: z.array(z.unknown()),
    createdAt: z.date(),
    updatedAt: z.date(),
    SourceLink: z.array(z.unknown())
}).strict();

export type ChartPureType = z.infer<typeof ChartModelSchema>;
