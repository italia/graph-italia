import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { UserOrderByWithRelationInputObjectSchema as UserOrderByWithRelationInputObjectSchema } from './UserOrderByWithRelationInput.schema';
import { SlotOrderByRelationAggregateInputObjectSchema as SlotOrderByRelationAggregateInputObjectSchema } from './SlotOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  publish: SortOrderSchema.optional(),
  userId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  user: z.lazy(() => UserOrderByWithRelationInputObjectSchema).optional(),
  slots: z.lazy(() => SlotOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const DashboardOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.DashboardOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.DashboardOrderByWithRelationInput>;
export const DashboardOrderByWithRelationInputObjectZodSchema = makeSchema();
