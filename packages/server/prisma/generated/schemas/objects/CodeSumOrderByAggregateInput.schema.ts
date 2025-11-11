import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  expire: SortOrderSchema.optional()
}).strict();
export const CodeSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.CodeSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.CodeSumOrderByAggregateInput>;
export const CodeSumOrderByAggregateInputObjectZodSchema = makeSchema();
