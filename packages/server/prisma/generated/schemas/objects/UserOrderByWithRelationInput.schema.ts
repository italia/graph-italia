import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { ChartOrderByRelationAggregateInputObjectSchema as ChartOrderByRelationAggregateInputObjectSchema } from './ChartOrderByRelationAggregateInput.schema';
import { DashboardOrderByRelationAggregateInputObjectSchema as DashboardOrderByRelationAggregateInputObjectSchema } from './DashboardOrderByRelationAggregateInput.schema';
import { DataSourceOrderByRelationAggregateInputObjectSchema as DataSourceOrderByRelationAggregateInputObjectSchema } from './DataSourceOrderByRelationAggregateInput.schema';
import { CodeOrderByRelationAggregateInputObjectSchema as CodeOrderByRelationAggregateInputObjectSchema } from './CodeOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  email: SortOrderSchema.optional(),
  password: SortOrderSchema.optional(),
  verifyed: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  Chart: z.lazy(() => ChartOrderByRelationAggregateInputObjectSchema).optional(),
  Dashboard: z.lazy(() => DashboardOrderByRelationAggregateInputObjectSchema).optional(),
  DataSource: z.lazy(() => DataSourceOrderByRelationAggregateInputObjectSchema).optional(),
  Code: z.lazy(() => CodeOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const UserOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.UserOrderByWithRelationInput>;
export const UserOrderByWithRelationInputObjectZodSchema = makeSchema();
