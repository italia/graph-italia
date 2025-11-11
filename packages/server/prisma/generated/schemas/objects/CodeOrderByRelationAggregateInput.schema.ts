import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const CodeOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.CodeOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.CodeOrderByRelationAggregateInput>;
export const CodeOrderByRelationAggregateInputObjectZodSchema = makeSchema();
