import * as z from 'zod';
export const SourceLinkUpdateResultSchema = z.nullable(z.object({
  dataSource: z.unknown(),
  dataSourceId: z.string(),
  chart: z.unknown(),
  chartId: z.string(),
  config: z.unknown().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
}));