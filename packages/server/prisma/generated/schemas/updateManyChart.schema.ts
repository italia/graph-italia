import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ChartUpdateManyMutationInputObjectSchema as ChartUpdateManyMutationInputObjectSchema } from './objects/ChartUpdateManyMutationInput.schema';
import { ChartWhereInputObjectSchema as ChartWhereInputObjectSchema } from './objects/ChartWhereInput.schema';

export const ChartUpdateManySchema: z.ZodType<Prisma.ChartUpdateManyArgs> = z.object({ data: ChartUpdateManyMutationInputObjectSchema, where: ChartWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ChartUpdateManyArgs>;

export const ChartUpdateManyZodSchema = z.object({ data: ChartUpdateManyMutationInputObjectSchema, where: ChartWhereInputObjectSchema.optional() }).strict();