import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { DashboardSelectObjectSchema as DashboardSelectObjectSchema } from './objects/DashboardSelect.schema';
import { DashboardIncludeObjectSchema as DashboardIncludeObjectSchema } from './objects/DashboardInclude.schema';
import { DashboardCreateInputObjectSchema as DashboardCreateInputObjectSchema } from './objects/DashboardCreateInput.schema';
import { DashboardUncheckedCreateInputObjectSchema as DashboardUncheckedCreateInputObjectSchema } from './objects/DashboardUncheckedCreateInput.schema';

export const DashboardCreateOneSchema: z.ZodType<Prisma.DashboardCreateArgs> = z.object({ select: DashboardSelectObjectSchema.optional(), include: DashboardIncludeObjectSchema.optional(), data: z.union([DashboardCreateInputObjectSchema, DashboardUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.DashboardCreateArgs>;

export const DashboardCreateOneZodSchema = z.object({ select: DashboardSelectObjectSchema.optional(), include: DashboardIncludeObjectSchema.optional(), data: z.union([DashboardCreateInputObjectSchema, DashboardUncheckedCreateInputObjectSchema]) }).strict();