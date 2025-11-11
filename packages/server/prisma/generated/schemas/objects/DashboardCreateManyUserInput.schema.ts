import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  publish: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const DashboardCreateManyUserInputObjectSchema: z.ZodType<Prisma.DashboardCreateManyUserInput> = makeSchema() as unknown as z.ZodType<Prisma.DashboardCreateManyUserInput>;
export const DashboardCreateManyUserInputObjectZodSchema = makeSchema();
