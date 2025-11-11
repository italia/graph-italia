import * as z from 'zod';

// prettier-ignore
export const DataSourceInputSchema = z.object({
    id: z.string(),
    name: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    data: z.unknown(),
    rules: z.unknown().optional().nullable(),
    publish: z.boolean(),
    isTrasposed: z.boolean(),
    remoteUrl: z.string().optional().nullable(),
    isRemote: z.boolean(),
    user: z.unknown(),
    userId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    SourceLink: z.array(z.unknown())
}).strict();

export type DataSourceInputType = z.infer<typeof DataSourceInputSchema>;
