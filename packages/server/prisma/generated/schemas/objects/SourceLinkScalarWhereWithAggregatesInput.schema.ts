import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { JsonNullableWithAggregatesFilterObjectSchema as JsonNullableWithAggregatesFilterObjectSchema } from './JsonNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const sourcelinkscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => SourceLinkScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => SourceLinkScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => SourceLinkScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => SourceLinkScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => SourceLinkScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  dataSourceId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  chartId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  config: z.lazy(() => JsonNullableWithAggregatesFilterObjectSchema).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const SourceLinkScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.SourceLinkScalarWhereWithAggregatesInput> = sourcelinkscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.SourceLinkScalarWhereWithAggregatesInput>;
export const SourceLinkScalarWhereWithAggregatesInputObjectZodSchema = sourcelinkscalarwherewithaggregatesinputSchema;
