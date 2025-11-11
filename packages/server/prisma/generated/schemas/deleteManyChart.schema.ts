import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ChartWhereInputObjectSchema as ChartWhereInputObjectSchema } from './objects/ChartWhereInput.schema';

export const ChartDeleteManySchema: z.ZodType<Prisma.ChartDeleteManyArgs> = z.object({ where: ChartWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ChartDeleteManyArgs>;

export const ChartDeleteManyZodSchema = z.object({ where: ChartWhereInputObjectSchema.optional() }).strict();