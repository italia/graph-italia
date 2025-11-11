import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  description: z.literal(true).optional(),
  data: z.literal(true).optional(),
  rules: z.literal(true).optional(),
  publish: z.literal(true).optional(),
  isTrasposed: z.literal(true).optional(),
  remoteUrl: z.literal(true).optional(),
  isRemote: z.literal(true).optional(),
  userId: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const DataSourceCountAggregateInputObjectSchema: z.ZodType<Prisma.DataSourceCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.DataSourceCountAggregateInputType>;
export const DataSourceCountAggregateInputObjectZodSchema = makeSchema();
