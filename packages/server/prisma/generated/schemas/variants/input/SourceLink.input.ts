import * as z from 'zod';

// prettier-ignore
export const SourceLinkInputSchema = z.object({
    dataSource: z.unknown(),
    dataSourceId: z.string(),
    chart: z.unknown(),
    chartId: z.string(),
    config: z.unknown().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type SourceLinkInputType = z.infer<typeof SourceLinkInputSchema>;
