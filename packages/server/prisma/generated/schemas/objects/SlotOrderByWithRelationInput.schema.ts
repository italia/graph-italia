import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { DashboardOrderByWithRelationInputObjectSchema as DashboardOrderByWithRelationInputObjectSchema } from './DashboardOrderByWithRelationInput.schema';
import { ChartOrderByWithRelationInputObjectSchema as ChartOrderByWithRelationInputObjectSchema } from './ChartOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  dashboardId: SortOrderSchema.optional(),
  chartId: SortOrderSchema.optional(),
  settings: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  name: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  dashboard: z.lazy(() => DashboardOrderByWithRelationInputObjectSchema).optional(),
  chart: z.lazy(() => ChartOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const SlotOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.SlotOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.SlotOrderByWithRelationInput>;
export const SlotOrderByWithRelationInputObjectZodSchema = makeSchema();
