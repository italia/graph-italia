import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const SlotOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.SlotOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.SlotOrderByRelationAggregateInput>;
export const SlotOrderByRelationAggregateInputObjectZodSchema = makeSchema();
