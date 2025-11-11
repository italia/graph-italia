import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { DataSourceOrderByWithRelationInputObjectSchema as DataSourceOrderByWithRelationInputObjectSchema } from './DataSourceOrderByWithRelationInput.schema';
import { ChartOrderByWithRelationInputObjectSchema as ChartOrderByWithRelationInputObjectSchema } from './ChartOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  dataSourceId: SortOrderSchema.optional(),
  chartId: SortOrderSchema.optional(),
  config: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  dataSource: z.lazy(() => DataSourceOrderByWithRelationInputObjectSchema).optional(),
  chart: z.lazy(() => ChartOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const SourceLinkOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.SourceLinkOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.SourceLinkOrderByWithRelationInput>;
export const SourceLinkOrderByWithRelationInputObjectZodSchema = makeSchema();
