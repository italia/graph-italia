import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DashboardCountOutputTypeSelectObjectSchema as DashboardCountOutputTypeSelectObjectSchema } from './DashboardCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => DashboardCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const DashboardCountOutputTypeArgsObjectSchema = makeSchema();
export const DashboardCountOutputTypeArgsObjectZodSchema = makeSchema();
