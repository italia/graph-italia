import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  expire: SortOrderSchema.optional(),
  userId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const CodeMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.CodeMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.CodeMaxOrderByAggregateInput>;
export const CodeMaxOrderByAggregateInputObjectZodSchema = makeSchema();
