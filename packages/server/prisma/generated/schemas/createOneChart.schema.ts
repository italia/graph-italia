import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ChartSelectObjectSchema as ChartSelectObjectSchema } from './objects/ChartSelect.schema';
import { ChartIncludeObjectSchema as ChartIncludeObjectSchema } from './objects/ChartInclude.schema';
import { ChartCreateInputObjectSchema as ChartCreateInputObjectSchema } from './objects/ChartCreateInput.schema';
import { ChartUncheckedCreateInputObjectSchema as ChartUncheckedCreateInputObjectSchema } from './objects/ChartUncheckedCreateInput.schema';

export const ChartCreateOneSchema: z.ZodType<Prisma.ChartCreateArgs> = z.object({ select: ChartSelectObjectSchema.optional(), include: ChartIncludeObjectSchema.optional(), data: z.union([ChartCreateInputObjectSchema, ChartUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.ChartCreateArgs>;

export const ChartCreateOneZodSchema = z.object({ select: ChartSelectObjectSchema.optional(), include: ChartIncludeObjectSchema.optional(), data: z.union([ChartCreateInputObjectSchema, ChartUncheckedCreateInputObjectSchema]) }).strict();