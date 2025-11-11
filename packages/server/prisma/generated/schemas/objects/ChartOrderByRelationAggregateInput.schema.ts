import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const ChartOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.ChartOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ChartOrderByRelationAggregateInput>;
export const ChartOrderByRelationAggregateInputObjectZodSchema = makeSchema();
