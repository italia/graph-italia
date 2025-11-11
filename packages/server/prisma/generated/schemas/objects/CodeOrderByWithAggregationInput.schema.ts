import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { CodeCountOrderByAggregateInputObjectSchema as CodeCountOrderByAggregateInputObjectSchema } from './CodeCountOrderByAggregateInput.schema';
import { CodeAvgOrderByAggregateInputObjectSchema as CodeAvgOrderByAggregateInputObjectSchema } from './CodeAvgOrderByAggregateInput.schema';
import { CodeMaxOrderByAggregateInputObjectSchema as CodeMaxOrderByAggregateInputObjectSchema } from './CodeMaxOrderByAggregateInput.schema';
import { CodeMinOrderByAggregateInputObjectSchema as CodeMinOrderByAggregateInputObjectSchema } from './CodeMinOrderByAggregateInput.schema';
import { CodeSumOrderByAggregateInputObjectSchema as CodeSumOrderByAggregateInputObjectSchema } from './CodeSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  expire: SortOrderSchema.optional(),
  userId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => CodeCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => CodeAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => CodeMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => CodeMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => CodeSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const CodeOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.CodeOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.CodeOrderByWithAggregationInput>;
export const CodeOrderByWithAggregationInputObjectZodSchema = makeSchema();
