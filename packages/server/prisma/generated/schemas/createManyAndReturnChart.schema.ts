import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ChartSelectObjectSchema as ChartSelectObjectSchema } from './objects/ChartSelect.schema';
import { ChartCreateManyInputObjectSchema as ChartCreateManyInputObjectSchema } from './objects/ChartCreateManyInput.schema';

export const ChartCreateManyAndReturnSchema: z.ZodType<Prisma.ChartCreateManyAndReturnArgs> = z.object({ select: ChartSelectObjectSchema.optional(), data: z.union([ ChartCreateManyInputObjectSchema, z.array(ChartCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.ChartCreateManyAndReturnArgs>;

export const ChartCreateManyAndReturnZodSchema = z.object({ select: ChartSelectObjectSchema.optional(), data: z.union([ ChartCreateManyInputObjectSchema, z.array(ChartCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();