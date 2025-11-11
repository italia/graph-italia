import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { JsonWithAggregatesFilterObjectSchema as JsonWithAggregatesFilterObjectSchema } from './JsonWithAggregatesFilter.schema';
import { JsonNullableWithAggregatesFilterObjectSchema as JsonNullableWithAggregatesFilterObjectSchema } from './JsonNullableWithAggregatesFilter.schema';
import { BoolWithAggregatesFilterObjectSchema as BoolWithAggregatesFilterObjectSchema } from './BoolWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const datasourcescalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => DataSourceScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => DataSourceScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => DataSourceScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => DataSourceScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => DataSourceScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  description: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  data: z.lazy(() => JsonWithAggregatesFilterObjectSchema).optional(),
  rules: z.lazy(() => JsonNullableWithAggregatesFilterObjectSchema).optional(),
  publish: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  isTrasposed: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  remoteUrl: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  isRemote: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  userId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const DataSourceScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.DataSourceScalarWhereWithAggregatesInput> = datasourcescalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.DataSourceScalarWhereWithAggregatesInput>;
export const DataSourceScalarWhereWithAggregatesInputObjectZodSchema = datasourcescalarwherewithaggregatesinputSchema;
