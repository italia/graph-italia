import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { UserOrderByWithRelationInputObjectSchema as UserOrderByWithRelationInputObjectSchema } from './UserOrderByWithRelationInput.schema';
import { SlotOrderByRelationAggregateInputObjectSchema as SlotOrderByRelationAggregateInputObjectSchema } from './SlotOrderByRelationAggregateInput.schema';
import { SourceLinkOrderByRelationAggregateInputObjectSchema as SourceLinkOrderByRelationAggregateInputObjectSchema } from './SourceLinkOrderByRelationAggregateInput.schema'

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
  user: z.lazy(() => UserOrderByWithRelationInputObjectSchema).optional(),
  slot: z.lazy(() => SlotOrderByRelationAggregateInputObjectSchema).optional(),
  SourceLink: z.lazy(() => SourceLinkOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const ChartOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.ChartOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.ChartOrderByWithRelationInput>;
export const ChartOrderByWithRelationInputObjectZodSchema = makeSchema();
