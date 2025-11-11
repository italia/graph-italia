import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { JsonNullableFilterObjectSchema as JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const slotscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => SlotScalarWhereInputObjectSchema), z.lazy(() => SlotScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => SlotScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => SlotScalarWhereInputObjectSchema), z.lazy(() => SlotScalarWhereInputObjectSchema).array()]).optional(),
  dashboardId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  chartId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  settings: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  name: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const SlotScalarWhereInputObjectSchema: z.ZodType<Prisma.SlotScalarWhereInput> = slotscalarwhereinputSchema as unknown as z.ZodType<Prisma.SlotScalarWhereInput>;
export const SlotScalarWhereInputObjectZodSchema = slotscalarwhereinputSchema;
