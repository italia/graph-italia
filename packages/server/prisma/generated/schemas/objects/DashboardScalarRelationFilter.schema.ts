import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DashboardWhereInputObjectSchema as DashboardWhereInputObjectSchema } from './DashboardWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => DashboardWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => DashboardWhereInputObjectSchema).optional()
}).strict();
export const DashboardScalarRelationFilterObjectSchema: z.ZodType<Prisma.DashboardScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.DashboardScalarRelationFilter>;
export const DashboardScalarRelationFilterObjectZodSchema = makeSchema();
