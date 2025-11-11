import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ChartCountOutputTypeSelectObjectSchema as ChartCountOutputTypeSelectObjectSchema } from './ChartCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => ChartCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const ChartCountOutputTypeArgsObjectSchema = makeSchema();
export const ChartCountOutputTypeArgsObjectZodSchema = makeSchema();
