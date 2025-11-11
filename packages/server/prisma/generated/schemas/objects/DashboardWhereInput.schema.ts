import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { UserScalarRelationFilterObjectSchema as UserScalarRelationFilterObjectSchema } from './UserScalarRelationFilter.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { SlotListRelationFilterObjectSchema as SlotListRelationFilterObjectSchema } from './SlotListRelationFilter.schema'

const dashboardwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => DashboardWhereInputObjectSchema), z.lazy(() => DashboardWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => DashboardWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => DashboardWhereInputObjectSchema), z.lazy(() => DashboardWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  publish: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  userId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  user: z.union([z.lazy(() => UserScalarRelationFilterObjectSchema), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  slots: z.lazy(() => SlotListRelationFilterObjectSchema).optional()
}).strict();
export const DashboardWhereInputObjectSchema: z.ZodType<Prisma.DashboardWhereInput> = dashboardwhereinputSchema as unknown as z.ZodType<Prisma.DashboardWhereInput>;
export const DashboardWhereInputObjectZodSchema = dashboardwhereinputSchema;
