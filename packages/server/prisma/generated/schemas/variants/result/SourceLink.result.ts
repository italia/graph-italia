import * as z from 'zod';

// prettier-ignore
export const SourceLinkResultSchema = z.object({
    dataSource: z.unknown(),
    dataSourceId: z.string(),
    chart: z.unknown(),
    chartId: z.string(),
    config: z.unknown().nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type SourceLinkResultType = z.infer<typeof SourceLinkResultSchema>;
