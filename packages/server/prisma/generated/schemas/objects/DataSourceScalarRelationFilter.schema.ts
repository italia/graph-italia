import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DataSourceWhereInputObjectSchema as DataSourceWhereInputObjectSchema } from './DataSourceWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => DataSourceWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => DataSourceWhereInputObjectSchema).optional()
}).strict();
export const DataSourceScalarRelationFilterObjectSchema: z.ZodType<Prisma.DataSourceScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.DataSourceScalarRelationFilter>;
export const DataSourceScalarRelationFilterObjectZodSchema = makeSchema();
