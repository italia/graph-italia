import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ChartSelectObjectSchema as ChartSelectObjectSchema } from './objects/ChartSelect.schema';
import { ChartUpdateManyMutationInputObjectSchema as ChartUpdateManyMutationInputObjectSchema } from './objects/ChartUpdateManyMutationInput.schema';
import { ChartWhereInputObjectSchema as ChartWhereInputObjectSchema } from './objects/ChartWhereInput.schema';

export const ChartUpdateManyAndReturnSchema: z.ZodType<Prisma.ChartUpdateManyAndReturnArgs> = z.object({ select: ChartSelectObjectSchema.optional(), data: ChartUpdateManyMutationInputObjectSchema, where: ChartWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ChartUpdateManyAndReturnArgs>;

export const ChartUpdateManyAndReturnZodSchema = z.object({ select: ChartSelectObjectSchema.optional(), data: ChartUpdateManyMutationInputObjectSchema, where: ChartWhereInputObjectSchema.optional() }).strict();