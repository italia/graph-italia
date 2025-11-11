import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { DashboardSelectObjectSchema as DashboardSelectObjectSchema } from './objects/DashboardSelect.schema';
import { DashboardUpdateManyMutationInputObjectSchema as DashboardUpdateManyMutationInputObjectSchema } from './objects/DashboardUpdateManyMutationInput.schema';
import { DashboardWhereInputObjectSchema as DashboardWhereInputObjectSchema } from './objects/DashboardWhereInput.schema';

export const DashboardUpdateManyAndReturnSchema: z.ZodType<Prisma.DashboardUpdateManyAndReturnArgs> = z.object({ select: DashboardSelectObjectSchema.optional(), data: DashboardUpdateManyMutationInputObjectSchema, where: DashboardWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.DashboardUpdateManyAndReturnArgs>;

export const DashboardUpdateManyAndReturnZodSchema = z.object({ select: DashboardSelectObjectSchema.optional(), data: DashboardUpdateManyMutationInputObjectSchema, where: DashboardWhereInputObjectSchema.optional() }).strict();