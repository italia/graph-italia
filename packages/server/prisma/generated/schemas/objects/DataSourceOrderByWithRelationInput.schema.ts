import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { UserOrderByWithRelationInputObjectSchema as UserOrderByWithRelationInputObjectSchema } from './UserOrderByWithRelationInput.schema';
import { SourceLinkOrderByRelationAggregateInputObjectSchema as SourceLinkOrderByRelationAggregateInputObjectSchema } from './SourceLinkOrderByRelationAggregateInput.schema'

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
  user: z.lazy(() => UserOrderByWithRelationInputObjectSchema).optional(),
  SourceLink: z.lazy(() => SourceLinkOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const DataSourceOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.DataSourceOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.DataSourceOrderByWithRelationInput>;
export const DataSourceOrderByWithRelationInputObjectZodSchema = makeSchema();
