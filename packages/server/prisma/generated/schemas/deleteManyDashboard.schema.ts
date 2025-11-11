import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { DashboardWhereInputObjectSchema as DashboardWhereInputObjectSchema } from './objects/DashboardWhereInput.schema';

export const DashboardDeleteManySchema: z.ZodType<Prisma.DashboardDeleteManyArgs> = z.object({ where: DashboardWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.DashboardDeleteManyArgs>;

export const DashboardDeleteManyZodSchema = z.object({ where: DashboardWhereInputObjectSchema.optional() }).strict();