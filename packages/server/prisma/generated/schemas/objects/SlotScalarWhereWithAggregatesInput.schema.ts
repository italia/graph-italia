import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { JsonNullableWithAggregatesFilterObjectSchema as JsonNullableWithAggregatesFilterObjectSchema } from './JsonNullableWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const slotscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => SlotScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => SlotScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => SlotScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => SlotScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => SlotScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  dashboardId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  chartId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  settings: z.lazy(() => JsonNullableWithAggregatesFilterObjectSchema).optional(),
  name: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  description: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const SlotScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.SlotScalarWhereWithAggregatesInput> = slotscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.SlotScalarWhereWithAggregatesInput>;
export const SlotScalarWhereWithAggregatesInputObjectZodSchema = slotscalarwherewithaggregatesinputSchema;
