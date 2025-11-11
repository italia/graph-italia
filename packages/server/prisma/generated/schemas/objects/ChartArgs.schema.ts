import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ChartSelectObjectSchema as ChartSelectObjectSchema } from './ChartSelect.schema';
import { ChartIncludeObjectSchema as ChartIncludeObjectSchema } from './ChartInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => ChartSelectObjectSchema).optional(),
  include: z.lazy(() => ChartIncludeObjectSchema).optional()
}).strict();
export const ChartArgsObjectSchema = makeSchema();
export const ChartArgsObjectZodSchema = makeSchema();
