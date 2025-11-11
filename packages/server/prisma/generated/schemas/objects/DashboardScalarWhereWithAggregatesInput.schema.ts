import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { BoolWithAggregatesFilterObjectSchema as BoolWithAggregatesFilterObjectSchema } from './BoolWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const dashboardscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => DashboardScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => DashboardScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => DashboardScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => DashboardScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => DashboardScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  description: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  publish: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  userId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const DashboardScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.DashboardScalarWhereWithAggregatesInput> = dashboardscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.DashboardScalarWhereWithAggregatesInput>;
export const DashboardScalarWhereWithAggregatesInputObjectZodSchema = dashboardscalarwherewithaggregatesinputSchema;
