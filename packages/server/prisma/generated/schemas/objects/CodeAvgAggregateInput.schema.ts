import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  expire: z.literal(true).optional()
}).strict();
export const CodeAvgAggregateInputObjectSchema: z.ZodType<Prisma.CodeAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.CodeAvgAggregateInputType>;
export const CodeAvgAggregateInputObjectZodSchema = makeSchema();
