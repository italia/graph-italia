import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const DashboardOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.DashboardOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.DashboardOrderByRelationAggregateInput>;
export const DashboardOrderByRelationAggregateInputObjectZodSchema = makeSchema();
