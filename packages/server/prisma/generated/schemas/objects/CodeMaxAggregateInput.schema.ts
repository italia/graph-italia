import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  code: z.literal(true).optional(),
  expire: z.literal(true).optional(),
  userId: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const CodeMaxAggregateInputObjectSchema: z.ZodType<Prisma.CodeMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.CodeMaxAggregateInputType>;
export const CodeMaxAggregateInputObjectZodSchema = makeSchema();
