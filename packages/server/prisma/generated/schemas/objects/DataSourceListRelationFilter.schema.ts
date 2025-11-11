import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DataSourceWhereInputObjectSchema as DataSourceWhereInputObjectSchema } from './DataSourceWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => DataSourceWhereInputObjectSchema).optional(),
  some: z.lazy(() => DataSourceWhereInputObjectSchema).optional(),
  none: z.lazy(() => DataSourceWhereInputObjectSchema).optional()
}).strict();
export const DataSourceListRelationFilterObjectSchema: z.ZodType<Prisma.DataSourceListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.DataSourceListRelationFilter>;
export const DataSourceListRelationFilterObjectZodSchema = makeSchema();
