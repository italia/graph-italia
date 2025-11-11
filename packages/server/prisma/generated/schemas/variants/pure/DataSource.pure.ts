import * as z from 'zod';

// prettier-ignore
export const DataSourceModelSchema = z.object({
    id: z.string(),
    name: z.string().nullable(),
    description: z.string().nullable(),
    data: z.unknown(),
    rules: z.unknown().nullable(),
    publish: z.boolean(),
    isTrasposed: z.boolean(),
    remoteUrl: z.string().nullable(),
    isRemote: z.boolean(),
    user: z.unknown(),
    userId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    SourceLink: z.array(z.unknown())
}).strict();

export type DataSourcePureType = z.infer<typeof DataSourceModelSchema>;
