import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { ChartCountOrderByAggregateInputObjectSchema as ChartCountOrderByAggregateInputObjectSchema } from './ChartCountOrderByAggregateInput.schema';
import { ChartMaxOrderByAggregateInputObjectSchema as ChartMaxOrderByAggregateInputObjectSchema } from './ChartMaxOrderByAggregateInput.schema';
import { ChartMinOrderByAggregateInputObjectSchema as ChartMinOrderByAggregateInputObjectSchema } from './ChartMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  chart: SortOrderSchema.optional(),
  config: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  data: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  publish: SortOrderSchema.optional(),
  remoteUrl: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  isRemote: SortOrderSchema.optional(),
  preview: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  userId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => ChartCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => ChartMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => ChartMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const ChartOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.ChartOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.ChartOrderByWithAggregationInput>;
export const ChartOrderByWithAggregationInputObjectZodSchema = makeSchema();
