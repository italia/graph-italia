import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { JsonNullableFilterObjectSchema as JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const sourcelinkscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => SourceLinkScalarWhereInputObjectSchema), z.lazy(() => SourceLinkScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => SourceLinkScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => SourceLinkScalarWhereInputObjectSchema), z.lazy(() => SourceLinkScalarWhereInputObjectSchema).array()]).optional(),
  dataSourceId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  chartId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  config: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const SourceLinkScalarWhereInputObjectSchema: z.ZodType<Prisma.SourceLinkScalarWhereInput> = sourcelinkscalarwhereinputSchema as unknown as z.ZodType<Prisma.SourceLinkScalarWhereInput>;
export const SourceLinkScalarWhereInputObjectZodSchema = sourcelinkscalarwhereinputSchema;
