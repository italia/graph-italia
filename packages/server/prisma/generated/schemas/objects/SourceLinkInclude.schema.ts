import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DataSourceArgsObjectSchema as DataSourceArgsObjectSchema } from './DataSourceArgs.schema';
import { ChartArgsObjectSchema as ChartArgsObjectSchema } from './ChartArgs.schema'

const makeSchema = () => z.object({
  dataSource: z.union([z.boolean(), z.lazy(() => DataSourceArgsObjectSchema)]).optional(),
  chart: z.union([z.boolean(), z.lazy(() => ChartArgsObjectSchema)]).optional()
}).strict();
export const SourceLinkIncludeObjectSchema: z.ZodType<Prisma.SourceLinkInclude> = makeSchema() as unknown as z.ZodType<Prisma.SourceLinkInclude>;
export const SourceLinkIncludeObjectZodSchema = makeSchema();
