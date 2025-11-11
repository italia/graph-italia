import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DataSourceSelectObjectSchema as DataSourceSelectObjectSchema } from './DataSourceSelect.schema';
import { DataSourceIncludeObjectSchema as DataSourceIncludeObjectSchema } from './DataSourceInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => DataSourceSelectObjectSchema).optional(),
  include: z.lazy(() => DataSourceIncludeObjectSchema).optional()
}).strict();
export const DataSourceArgsObjectSchema = makeSchema();
export const DataSourceArgsObjectZodSchema = makeSchema();
