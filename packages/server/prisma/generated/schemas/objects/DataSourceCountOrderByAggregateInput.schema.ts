import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  data: SortOrderSchema.optional(),
  rules: SortOrderSchema.optional(),
  publish: SortOrderSchema.optional(),
  isTrasposed: SortOrderSchema.optional(),
  remoteUrl: SortOrderSchema.optional(),
  isRemote: SortOrderSchema.optional(),
  userId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const DataSourceCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.DataSourceCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.DataSourceCountOrderByAggregateInput>;
export const DataSourceCountOrderByAggregateInputObjectZodSchema = makeSchema();
