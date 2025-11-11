import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { DataSourceCountOrderByAggregateInputObjectSchema as DataSourceCountOrderByAggregateInputObjectSchema } from './DataSourceCountOrderByAggregateInput.schema';
import { DataSourceMaxOrderByAggregateInputObjectSchema as DataSourceMaxOrderByAggregateInputObjectSchema } from './DataSourceMaxOrderByAggregateInput.schema';
import { DataSourceMinOrderByAggregateInputObjectSchema as DataSourceMinOrderByAggregateInputObjectSchema } from './DataSourceMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  data: SortOrderSchema.optional(),
  rules: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  publish: SortOrderSchema.optional(),
  isTrasposed: SortOrderSchema.optional(),
  remoteUrl: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  isRemote: SortOrderSchema.optional(),
  userId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => DataSourceCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => DataSourceMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => DataSourceMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const DataSourceOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.DataSourceOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.DataSourceOrderByWithAggregationInput>;
export const DataSourceOrderByWithAggregationInputObjectZodSchema = makeSchema();
