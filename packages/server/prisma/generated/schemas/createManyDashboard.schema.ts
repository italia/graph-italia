import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { DashboardCreateManyInputObjectSchema as DashboardCreateManyInputObjectSchema } from './objects/DashboardCreateManyInput.schema';

export const DashboardCreateManySchema: z.ZodType<Prisma.DashboardCreateManyArgs> = z.object({ data: z.union([ DashboardCreateManyInputObjectSchema, z.array(DashboardCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.DashboardCreateManyArgs>;

export const DashboardCreateManyZodSchema = z.object({ data: z.union([ DashboardCreateManyInputObjectSchema, z.array(DashboardCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();