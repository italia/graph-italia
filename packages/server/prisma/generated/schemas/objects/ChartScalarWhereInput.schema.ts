import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { JsonNullableFilterObjectSchema as JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const chartscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => ChartScalarWhereInputObjectSchema), z.lazy(() => ChartScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ChartScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ChartScalarWhereInputObjectSchema), z.lazy(() => ChartScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  chart: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  config: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  data: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  publish: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  remoteUrl: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  isRemote: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  preview: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  userId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const ChartScalarWhereInputObjectSchema: z.ZodType<Prisma.ChartScalarWhereInput> = chartscalarwhereinputSchema as unknown as z.ZodType<Prisma.ChartScalarWhereInput>;
export const ChartScalarWhereInputObjectZodSchema = chartscalarwhereinputSchema;
