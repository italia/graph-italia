import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { JsonNullableFilterObjectSchema as JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { DashboardScalarRelationFilterObjectSchema as DashboardScalarRelationFilterObjectSchema } from './DashboardScalarRelationFilter.schema';
import { DashboardWhereInputObjectSchema as DashboardWhereInputObjectSchema } from './DashboardWhereInput.schema';
import { ChartScalarRelationFilterObjectSchema as ChartScalarRelationFilterObjectSchema } from './ChartScalarRelationFilter.schema';
import { ChartWhereInputObjectSchema as ChartWhereInputObjectSchema } from './ChartWhereInput.schema'

const slotwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => SlotWhereInputObjectSchema), z.lazy(() => SlotWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => SlotWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => SlotWhereInputObjectSchema), z.lazy(() => SlotWhereInputObjectSchema).array()]).optional(),
  dashboardId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  chartId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  settings: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  name: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  dashboard: z.union([z.lazy(() => DashboardScalarRelationFilterObjectSchema), z.lazy(() => DashboardWhereInputObjectSchema)]).optional(),
  chart: z.union([z.lazy(() => ChartScalarRelationFilterObjectSchema), z.lazy(() => ChartWhereInputObjectSchema)]).optional()
}).strict();
export const SlotWhereInputObjectSchema: z.ZodType<Prisma.SlotWhereInput> = slotwhereinputSchema as unknown as z.ZodType<Prisma.SlotWhereInput>;
export const SlotWhereInputObjectZodSchema = slotwhereinputSchema;
