import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  dataSourceId: z.literal(true).optional(),
  chartId: z.literal(true).optional(),
  config: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const SourceLinkCountAggregateInputObjectSchema: z.ZodType<Prisma.SourceLinkCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.SourceLinkCountAggregateInputType>;
export const SourceLinkCountAggregateInputObjectZodSchema = makeSchema();
