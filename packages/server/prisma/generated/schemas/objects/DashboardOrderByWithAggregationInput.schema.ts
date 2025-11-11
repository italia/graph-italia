import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { DashboardCountOrderByAggregateInputObjectSchema as DashboardCountOrderByAggregateInputObjectSchema } from './DashboardCountOrderByAggregateInput.schema';
import { DashboardMaxOrderByAggregateInputObjectSchema as DashboardMaxOrderByAggregateInputObjectSchema } from './DashboardMaxOrderByAggregateInput.schema';
import { DashboardMinOrderByAggregateInputObjectSchema as DashboardMinOrderByAggregateInputObjectSchema } from './DashboardMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  publish: SortOrderSchema.optional(),
  userId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => DashboardCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => DashboardMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => DashboardMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const DashboardOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.DashboardOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.DashboardOrderByWithAggregationInput>;
export const DashboardOrderByWithAggregationInputObjectZodSchema = makeSchema();
