import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  dataSourceId: z.literal(true).optional(),
  chartId: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const SourceLinkMinAggregateInputObjectSchema: z.ZodType<Prisma.SourceLinkMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.SourceLinkMinAggregateInputType>;
export const SourceLinkMinAggregateInputObjectZodSchema = makeSchema();
