import * as z from 'zod';
export const SlotFindFirstResultSchema = z.nullable(z.object({
  dashboard: z.unknown(),
  dashboardId: z.string(),
  chart: z.unknown(),
  chartId: z.string(),
  settings: z.unknown().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
}));