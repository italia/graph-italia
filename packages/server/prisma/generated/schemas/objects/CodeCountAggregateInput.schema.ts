import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  code: z.literal(true).optional(),
  expire: z.literal(true).optional(),
  userId: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const CodeCountAggregateInputObjectSchema: z.ZodType<Prisma.CodeCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.CodeCountAggregateInputType>;
export const CodeCountAggregateInputObjectZodSchema = makeSchema();
