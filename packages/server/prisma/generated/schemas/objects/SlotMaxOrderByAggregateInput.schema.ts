import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  dashboardId: SortOrderSchema.optional(),
  chartId: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const SlotMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.SlotMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.SlotMaxOrderByAggregateInput>;
export const SlotMaxOrderByAggregateInputObjectZodSchema = makeSchema();
