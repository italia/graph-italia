import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { SlotCountOrderByAggregateInputObjectSchema as SlotCountOrderByAggregateInputObjectSchema } from './SlotCountOrderByAggregateInput.schema';
import { SlotMaxOrderByAggregateInputObjectSchema as SlotMaxOrderByAggregateInputObjectSchema } from './SlotMaxOrderByAggregateInput.schema';
import { SlotMinOrderByAggregateInputObjectSchema as SlotMinOrderByAggregateInputObjectSchema } from './SlotMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  dashboardId: SortOrderSchema.optional(),
  chartId: SortOrderSchema.optional(),
  settings: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  name: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => SlotCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => SlotMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => SlotMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const SlotOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.SlotOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.SlotOrderByWithAggregationInput>;
export const SlotOrderByWithAggregationInputObjectZodSchema = makeSchema();
