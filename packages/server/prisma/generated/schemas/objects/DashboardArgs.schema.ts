import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DashboardSelectObjectSchema as DashboardSelectObjectSchema } from './DashboardSelect.schema';
import { DashboardIncludeObjectSchema as DashboardIncludeObjectSchema } from './DashboardInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => DashboardSelectObjectSchema).optional(),
  include: z.lazy(() => DashboardIncludeObjectSchema).optional()
}).strict();
export const DashboardArgsObjectSchema = makeSchema();
export const DashboardArgsObjectZodSchema = makeSchema();
