import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { DashboardSelectObjectSchema as DashboardSelectObjectSchema } from './objects/DashboardSelect.schema';
import { DashboardCreateManyInputObjectSchema as DashboardCreateManyInputObjectSchema } from './objects/DashboardCreateManyInput.schema';

export const DashboardCreateManyAndReturnSchema: z.ZodType<Prisma.DashboardCreateManyAndReturnArgs> = z.object({ select: DashboardSelectObjectSchema.optional(), data: z.union([ DashboardCreateManyInputObjectSchema, z.array(DashboardCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.DashboardCreateManyAndReturnArgs>;

export const DashboardCreateManyAndReturnZodSchema = z.object({ select: DashboardSelectObjectSchema.optional(), data: z.union([ DashboardCreateManyInputObjectSchema, z.array(DashboardCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();