import * as z from 'zod';
export const SlotGroupByResultSchema = z.array(z.object({
  dashboardId: z.string(),
  chartId: z.string(),
  settings: z.unknown(),
  name: z.string(),
  description: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  _count: z.object({
    dashboard: z.number(),
    dashboardId: z.number(),
    chart: z.number(),
    chartId: z.number(),
    settings: z.number(),
    name: z.number(),
    description: z.number(),
    createdAt: z.number(),
    updatedAt: z.number()
  }).optional(),
  _min: z.object({
    dashboardId: z.string().nullable(),
    chartId: z.string().nullable(),
    name: z.string().nullable(),
    description: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    dashboardId: z.string().nullable(),
    chartId: z.string().nullable(),
    name: z.string().nullable(),
    description: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()
}));