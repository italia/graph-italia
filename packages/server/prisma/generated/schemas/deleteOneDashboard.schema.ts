import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { DashboardSelectObjectSchema as DashboardSelectObjectSchema } from './objects/DashboardSelect.schema';
import { DashboardIncludeObjectSchema as DashboardIncludeObjectSchema } from './objects/DashboardInclude.schema';
import { DashboardWhereUniqueInputObjectSchema as DashboardWhereUniqueInputObjectSchema } from './objects/DashboardWhereUniqueInput.schema';

export const DashboardDeleteOneSchema: z.ZodType<Prisma.DashboardDeleteArgs> = z.object({ select: DashboardSelectObjectSchema.optional(), include: DashboardIncludeObjectSchema.optional(), where: DashboardWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.DashboardDeleteArgs>;

export const DashboardDeleteOneZodSchema = z.object({ select: DashboardSelectObjectSchema.optional(), include: DashboardIncludeObjectSchema.optional(), where: DashboardWhereUniqueInputObjectSchema }).strict();