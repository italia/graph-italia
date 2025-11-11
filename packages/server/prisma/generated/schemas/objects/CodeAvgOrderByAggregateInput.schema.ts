import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  expire: SortOrderSchema.optional()
}).strict();
export const CodeAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.CodeAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.CodeAvgOrderByAggregateInput>;
export const CodeAvgOrderByAggregateInputObjectZodSchema = makeSchema();
