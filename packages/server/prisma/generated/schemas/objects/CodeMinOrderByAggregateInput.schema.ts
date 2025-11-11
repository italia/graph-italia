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
export const CodeMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.CodeMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.CodeMinOrderByAggregateInput>;
export const CodeMinOrderByAggregateInputObjectZodSchema = makeSchema();
