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
export const CodeMinAggregateInputObjectSchema: z.ZodType<Prisma.CodeMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.CodeMinAggregateInputType>;
export const CodeMinAggregateInputObjectZodSchema = makeSchema();
