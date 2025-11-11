import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const dashboardscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => DashboardScalarWhereInputObjectSchema), z.lazy(() => DashboardScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => DashboardScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => DashboardScalarWhereInputObjectSchema), z.lazy(() => DashboardScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  publish: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  userId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const DashboardScalarWhereInputObjectSchema: z.ZodType<Prisma.DashboardScalarWhereInput> = dashboardscalarwhereinputSchema as unknown as z.ZodType<Prisma.DashboardScalarWhereInput>;
export const DashboardScalarWhereInputObjectZodSchema = dashboardscalarwhereinputSchema;
