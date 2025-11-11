import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DashboardArgsObjectSchema as DashboardArgsObjectSchema } from './DashboardArgs.schema';
import { ChartArgsObjectSchema as ChartArgsObjectSchema } from './ChartArgs.schema'

const makeSchema = () => z.object({
  dashboard: z.union([z.boolean(), z.lazy(() => DashboardArgsObjectSchema)]).optional(),
  chart: z.union([z.boolean(), z.lazy(() => ChartArgsObjectSchema)]).optional()
}).strict();
export const SlotIncludeObjectSchema: z.ZodType<Prisma.SlotInclude> = makeSchema() as unknown as z.ZodType<Prisma.SlotInclude>;
export const SlotIncludeObjectZodSchema = makeSchema();
