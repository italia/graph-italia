import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const DataSourceOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.DataSourceOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.DataSourceOrderByRelationAggregateInput>;
export const DataSourceOrderByRelationAggregateInputObjectZodSchema = makeSchema();
