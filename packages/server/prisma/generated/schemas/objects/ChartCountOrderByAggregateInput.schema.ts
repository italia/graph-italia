import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  chart: SortOrderSchema.optional(),
  config: SortOrderSchema.optional(),
  data: SortOrderSchema.optional(),
  publish: SortOrderSchema.optional(),
  remoteUrl: SortOrderSchema.optional(),
  isRemote: SortOrderSchema.optional(),
  preview: SortOrderSchema.optional(),
  userId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const ChartCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ChartCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ChartCountOrderByAggregateInput>;
export const ChartCountOrderByAggregateInputObjectZodSchema = makeSchema();
