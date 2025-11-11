import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ChartSelectObjectSchema as ChartSelectObjectSchema } from './objects/ChartSelect.schema';
import { ChartIncludeObjectSchema as ChartIncludeObjectSchema } from './objects/ChartInclude.schema';
import { ChartWhereUniqueInputObjectSchema as ChartWhereUniqueInputObjectSchema } from './objects/ChartWhereUniqueInput.schema';

export const ChartDeleteOneSchema: z.ZodType<Prisma.ChartDeleteArgs> = z.object({ select: ChartSelectObjectSchema.optional(), include: ChartIncludeObjectSchema.optional(), where: ChartWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ChartDeleteArgs>;

export const ChartDeleteOneZodSchema = z.object({ select: ChartSelectObjectSchema.optional(), include: ChartIncludeObjectSchema.optional(), where: ChartWhereUniqueInputObjectSchema }).strict();