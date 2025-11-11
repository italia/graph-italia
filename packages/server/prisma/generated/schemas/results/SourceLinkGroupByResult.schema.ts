import * as z from 'zod';
export const SourceLinkGroupByResultSchema = z.array(z.object({
  dataSourceId: z.string(),
  chartId: z.string(),
  config: z.unknown(),
  createdAt: z.date(),
  updatedAt: z.date(),
  _count: z.object({
    dataSource: z.number(),
    dataSourceId: z.number(),
    chart: z.number(),
    chartId: z.number(),
    config: z.number(),
    createdAt: z.number(),
    updatedAt: z.number()
  }).optional(),
  _min: z.object({
    dataSourceId: z.string().nullable(),
    chartId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    dataSourceId: z.string().nullable(),
    chartId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()
}));