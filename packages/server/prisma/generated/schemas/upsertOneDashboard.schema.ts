import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { DashboardSelectObjectSchema as DashboardSelectObjectSchema } from './objects/DashboardSelect.schema';
import { DashboardIncludeObjectSchema as DashboardIncludeObjectSchema } from './objects/DashboardInclude.schema';
import { DashboardWhereUniqueInputObjectSchema as DashboardWhereUniqueInputObjectSchema } from './objects/DashboardWhereUniqueInput.schema';
import { DashboardCreateInputObjectSchema as DashboardCreateInputObjectSchema } from './objects/DashboardCreateInput.schema';
import { DashboardUncheckedCreateInputObjectSchema as DashboardUncheckedCreateInputObjectSchema } from './objects/DashboardUncheckedCreateInput.schema';
import { DashboardUpdateInputObjectSchema as DashboardUpdateInputObjectSchema } from './objects/DashboardUpdateInput.schema';
import { DashboardUncheckedUpdateInputObjectSchema as DashboardUncheckedUpdateInputObjectSchema } from './objects/DashboardUncheckedUpdateInput.schema';

export const DashboardUpsertOneSchema: z.ZodType<Prisma.DashboardUpsertArgs> = z.object({ select: DashboardSelectObjectSchema.optional(), include: DashboardIncludeObjectSchema.optional(), where: DashboardWhereUniqueInputObjectSchema, create: z.union([ DashboardCreateInputObjectSchema, DashboardUncheckedCreateInputObjectSchema ]), update: z.union([ DashboardUpdateInputObjectSchema, DashboardUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.DashboardUpsertArgs>;

export const DashboardUpsertOneZodSchema = z.object({ select: DashboardSelectObjectSchema.optional(), include: DashboardIncludeObjectSchema.optional(), where: DashboardWhereUniqueInputObjectSchema, create: z.union([ DashboardCreateInputObjectSchema, DashboardUncheckedCreateInputObjectSchema ]), update: z.union([ DashboardUpdateInputObjectSchema, DashboardUncheckedUpdateInputObjectSchema ]) }).strict();