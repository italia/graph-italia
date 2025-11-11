import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  dataSourceId: SortOrderSchema.optional(),
  chartId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const SourceLinkMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.SourceLinkMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.SourceLinkMinOrderByAggregateInput>;
export const SourceLinkMinOrderByAggregateInputObjectZodSchema = makeSchema();
