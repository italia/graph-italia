import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DataSourceCountOutputTypeSelectObjectSchema as DataSourceCountOutputTypeSelectObjectSchema } from './DataSourceCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => DataSourceCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const DataSourceCountOutputTypeArgsObjectSchema = makeSchema();
export const DataSourceCountOutputTypeArgsObjectZodSchema = makeSchema();
