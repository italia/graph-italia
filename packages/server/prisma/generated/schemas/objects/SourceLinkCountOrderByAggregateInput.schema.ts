import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  dataSourceId: SortOrderSchema.optional(),
  chartId: SortOrderSchema.optional(),
  config: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const SourceLinkCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.SourceLinkCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.SourceLinkCountOrderByAggregateInput>;
export const SourceLinkCountOrderByAggregateInputObjectZodSchema = makeSchema();
