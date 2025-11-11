import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DashboardArgsObjectSchema as DashboardArgsObjectSchema } from './DashboardArgs.schema';
import { ChartArgsObjectSchema as ChartArgsObjectSchema } from './ChartArgs.schema'

const makeSchema = () => z.object({
  dashboard: z.union([z.boolean(), z.lazy(() => DashboardArgsObjectSchema)]).optional(),
  dashboardId: z.boolean().optional(),
  chart: z.union([z.boolean(), z.lazy(() => ChartArgsObjectSchema)]).optional(),
  chartId: z.boolean().optional(),
  settings: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional()
}).strict();
export const SlotSelectObjectSchema: z.ZodType<Prisma.SlotSelect> = makeSchema() as unknown as z.ZodType<Prisma.SlotSelect>;
export const SlotSelectObjectZodSchema = makeSchema();
