import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  expire: z.literal(true).optional()
}).strict();
export const CodeSumAggregateInputObjectSchema: z.ZodType<Prisma.CodeSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.CodeSumAggregateInputType>;
export const CodeSumAggregateInputObjectZodSchema = makeSchema();
