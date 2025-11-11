import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DashboardWhereInputObjectSchema as DashboardWhereInputObjectSchema } from './DashboardWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => DashboardWhereInputObjectSchema).optional(),
  some: z.lazy(() => DashboardWhereInputObjectSchema).optional(),
  none: z.lazy(() => DashboardWhereInputObjectSchema).optional()
}).strict();
export const DashboardListRelationFilterObjectSchema: z.ZodType<Prisma.DashboardListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.DashboardListRelationFilter>;
export const DashboardListRelationFilterObjectZodSchema = makeSchema();
