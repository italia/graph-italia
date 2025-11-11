import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DataSourceArgsObjectSchema as DataSourceArgsObjectSchema } from './DataSourceArgs.schema';
import { ChartArgsObjectSchema as ChartArgsObjectSchema } from './ChartArgs.schema'

const makeSchema = () => z.object({
  dataSource: z.union([z.boolean(), z.lazy(() => DataSourceArgsObjectSchema)]).optional(),
  dataSourceId: z.boolean().optional(),
  chart: z.union([z.boolean(), z.lazy(() => ChartArgsObjectSchema)]).optional(),
  chartId: z.boolean().optional(),
  config: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional()
}).strict();
export const SourceLinkSelectObjectSchema: z.ZodType<Prisma.SourceLinkSelect> = makeSchema() as unknown as z.ZodType<Prisma.SourceLinkSelect>;
export const SourceLinkSelectObjectZodSchema = makeSchema();
