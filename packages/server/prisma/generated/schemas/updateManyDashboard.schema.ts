import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { DashboardUpdateManyMutationInputObjectSchema as DashboardUpdateManyMutationInputObjectSchema } from './objects/DashboardUpdateManyMutationInput.schema';
import { DashboardWhereInputObjectSchema as DashboardWhereInputObjectSchema } from './objects/DashboardWhereInput.schema';

export const DashboardUpdateManySchema: z.ZodType<Prisma.DashboardUpdateManyArgs> = z.object({ data: DashboardUpdateManyMutationInputObjectSchema, where: DashboardWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.DashboardUpdateManyArgs>;

export const DashboardUpdateManyZodSchema = z.object({ data: DashboardUpdateManyMutationInputObjectSchema, where: DashboardWhereInputObjectSchema.optional() }).strict();