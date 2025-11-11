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
export const SlotMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.SlotMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.SlotMinOrderByAggregateInput>;
export const SlotMinOrderByAggregateInputObjectZodSchema = makeSchema();
