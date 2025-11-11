import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ChartCreateManyInputObjectSchema as ChartCreateManyInputObjectSchema } from './objects/ChartCreateManyInput.schema';

export const ChartCreateManySchema: z.ZodType<Prisma.ChartCreateManyArgs> = z.object({ data: z.union([ ChartCreateManyInputObjectSchema, z.array(ChartCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.ChartCreateManyArgs>;

export const ChartCreateManyZodSchema = z.object({ data: z.union([ ChartCreateManyInputObjectSchema, z.array(ChartCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();