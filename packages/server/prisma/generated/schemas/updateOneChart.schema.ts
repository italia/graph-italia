import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ChartSelectObjectSchema as ChartSelectObjectSchema } from './objects/ChartSelect.schema';
import { ChartIncludeObjectSchema as ChartIncludeObjectSchema } from './objects/ChartInclude.schema';
import { ChartUpdateInputObjectSchema as ChartUpdateInputObjectSchema } from './objects/ChartUpdateInput.schema';
import { ChartUncheckedUpdateInputObjectSchema as ChartUncheckedUpdateInputObjectSchema } from './objects/ChartUncheckedUpdateInput.schema';
import { ChartWhereUniqueInputObjectSchema as ChartWhereUniqueInputObjectSchema } from './objects/ChartWhereUniqueInput.schema';

export const ChartUpdateOneSchema: z.ZodType<Prisma.ChartUpdateArgs> = z.object({ select: ChartSelectObjectSchema.optional(), include: ChartIncludeObjectSchema.optional(), data: z.union([ChartUpdateInputObjectSchema, ChartUncheckedUpdateInputObjectSchema]), where: ChartWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ChartUpdateArgs>;

export const ChartUpdateOneZodSchema = z.object({ select: ChartSelectObjectSchema.optional(), include: ChartIncludeObjectSchema.optional(), data: z.union([ChartUpdateInputObjectSchema, ChartUncheckedUpdateInputObjectSchema]), where: ChartWhereUniqueInputObjectSchema }).strict();