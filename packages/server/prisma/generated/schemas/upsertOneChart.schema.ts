import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ChartSelectObjectSchema as ChartSelectObjectSchema } from './objects/ChartSelect.schema';
import { ChartIncludeObjectSchema as ChartIncludeObjectSchema } from './objects/ChartInclude.schema';
import { ChartWhereUniqueInputObjectSchema as ChartWhereUniqueInputObjectSchema } from './objects/ChartWhereUniqueInput.schema';
import { ChartCreateInputObjectSchema as ChartCreateInputObjectSchema } from './objects/ChartCreateInput.schema';
import { ChartUncheckedCreateInputObjectSchema as ChartUncheckedCreateInputObjectSchema } from './objects/ChartUncheckedCreateInput.schema';
import { ChartUpdateInputObjectSchema as ChartUpdateInputObjectSchema } from './objects/ChartUpdateInput.schema';
import { ChartUncheckedUpdateInputObjectSchema as ChartUncheckedUpdateInputObjectSchema } from './objects/ChartUncheckedUpdateInput.schema';

export const ChartUpsertOneSchema: z.ZodType<Prisma.ChartUpsertArgs> = z.object({ select: ChartSelectObjectSchema.optional(), include: ChartIncludeObjectSchema.optional(), where: ChartWhereUniqueInputObjectSchema, create: z.union([ ChartCreateInputObjectSchema, ChartUncheckedCreateInputObjectSchema ]), update: z.union([ ChartUpdateInputObjectSchema, ChartUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.ChartUpsertArgs>;

export const ChartUpsertOneZodSchema = z.object({ select: ChartSelectObjectSchema.optional(), include: ChartIncludeObjectSchema.optional(), where: ChartWhereUniqueInputObjectSchema, create: z.union([ ChartCreateInputObjectSchema, ChartUncheckedCreateInputObjectSchema ]), update: z.union([ ChartUpdateInputObjectSchema, ChartUncheckedUpdateInputObjectSchema ]) }).strict();