import * as z from 'zod';
export const SourceLinkFindManyResultSchema = z.object({
  data: z.array(z.object({
  dataSource: z.unknown(),
  dataSourceId: z.string(),
  chart: z.unknown(),
  chartId: z.string(),
  config: z.unknown().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
})),
  pagination: z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  hasNext: z.boolean(),
  hasPrev: z.boolean()
})
});