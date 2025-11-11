import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { JsonNullableFilterObjectSchema as JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { DataSourceScalarRelationFilterObjectSchema as DataSourceScalarRelationFilterObjectSchema } from './DataSourceScalarRelationFilter.schema';
import { DataSourceWhereInputObjectSchema as DataSourceWhereInputObjectSchema } from './DataSourceWhereInput.schema';
import { ChartScalarRelationFilterObjectSchema as ChartScalarRelationFilterObjectSchema } from './ChartScalarRelationFilter.schema';
import { ChartWhereInputObjectSchema as ChartWhereInputObjectSchema } from './ChartWhereInput.schema'

const sourcelinkwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => SourceLinkWhereInputObjectSchema), z.lazy(() => SourceLinkWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => SourceLinkWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => SourceLinkWhereInputObjectSchema), z.lazy(() => SourceLinkWhereInputObjectSchema).array()]).optional(),
  dataSourceId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  chartId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  config: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  dataSource: z.union([z.lazy(() => DataSourceScalarRelationFilterObjectSchema), z.lazy(() => DataSourceWhereInputObjectSchema)]).optional(),
  chart: z.union([z.lazy(() => ChartScalarRelationFilterObjectSchema), z.lazy(() => ChartWhereInputObjectSchema)]).optional()
}).strict();
export const SourceLinkWhereInputObjectSchema: z.ZodType<Prisma.SourceLinkWhereInput> = sourcelinkwhereinputSchema as unknown as z.ZodType<Prisma.SourceLinkWhereInput>;
export const SourceLinkWhereInputObjectZodSchema = sourcelinkwhereinputSchema;
