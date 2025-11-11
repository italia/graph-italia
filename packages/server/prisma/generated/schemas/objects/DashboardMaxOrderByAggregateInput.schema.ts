import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  publish: SortOrderSchema.optional(),
  userId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const DashboardMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.DashboardMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.DashboardMaxOrderByAggregateInput>;
export const DashboardMaxOrderByAggregateInputObjectZodSchema = makeSchema();
