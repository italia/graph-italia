import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { DashboardSelectObjectSchema as DashboardSelectObjectSchema } from './objects/DashboardSelect.schema';
import { DashboardIncludeObjectSchema as DashboardIncludeObjectSchema } from './objects/DashboardInclude.schema';
import { DashboardUpdateInputObjectSchema as DashboardUpdateInputObjectSchema } from './objects/DashboardUpdateInput.schema';
import { DashboardUncheckedUpdateInputObjectSchema as DashboardUncheckedUpdateInputObjectSchema } from './objects/DashboardUncheckedUpdateInput.schema';
import { DashboardWhereUniqueInputObjectSchema as DashboardWhereUniqueInputObjectSchema } from './objects/DashboardWhereUniqueInput.schema';

export const DashboardUpdateOneSchema: z.ZodType<Prisma.DashboardUpdateArgs> = z.object({ select: DashboardSelectObjectSchema.optional(), include: DashboardIncludeObjectSchema.optional(), data: z.union([DashboardUpdateInputObjectSchema, DashboardUncheckedUpdateInputObjectSchema]), where: DashboardWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.DashboardUpdateArgs>;

export const DashboardUpdateOneZodSchema = z.object({ select: DashboardSelectObjectSchema.optional(), include: DashboardIncludeObjectSchema.optional(), data: z.union([DashboardUpdateInputObjectSchema, DashboardUncheckedUpdateInputObjectSchema]), where: DashboardWhereUniqueInputObjectSchema }).strict();