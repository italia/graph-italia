import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const SourceLinkOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.SourceLinkOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.SourceLinkOrderByRelationAggregateInput>;
export const SourceLinkOrderByRelationAggregateInputObjectZodSchema = makeSchema();
