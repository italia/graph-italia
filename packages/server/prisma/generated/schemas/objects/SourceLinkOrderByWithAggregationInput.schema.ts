import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { SourceLinkCountOrderByAggregateInputObjectSchema as SourceLinkCountOrderByAggregateInputObjectSchema } from './SourceLinkCountOrderByAggregateInput.schema';
import { SourceLinkMaxOrderByAggregateInputObjectSchema as SourceLinkMaxOrderByAggregateInputObjectSchema } from './SourceLinkMaxOrderByAggregateInput.schema';
import { SourceLinkMinOrderByAggregateInputObjectSchema as SourceLinkMinOrderByAggregateInputObjectSchema } from './SourceLinkMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  dataSourceId: SortOrderSchema.optional(),
  chartId: SortOrderSchema.optional(),
  config: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => SourceLinkCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => SourceLinkMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => SourceLinkMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const SourceLinkOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.SourceLinkOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.SourceLinkOrderByWithAggregationInput>;
export const SourceLinkOrderByWithAggregationInputObjectZodSchema = makeSchema();
