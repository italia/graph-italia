import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  dataSourceId: z.literal(true).optional(),
  chartId: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const SourceLinkMaxAggregateInputObjectSchema: z.ZodType<Prisma.SourceLinkMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.SourceLinkMaxAggregateInputType>;
export const SourceLinkMaxAggregateInputObjectZodSchema = makeSchema();
