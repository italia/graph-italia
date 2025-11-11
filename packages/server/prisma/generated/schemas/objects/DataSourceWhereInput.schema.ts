import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { JsonFilterObjectSchema as JsonFilterObjectSchema } from './JsonFilter.schema';
import { JsonNullableFilterObjectSchema as JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { UserScalarRelationFilterObjectSchema as UserScalarRelationFilterObjectSchema } from './UserScalarRelationFilter.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { SourceLinkListRelationFilterObjectSchema as SourceLinkListRelationFilterObjectSchema } from './SourceLinkListRelationFilter.schema'

const datasourcewhereinputSchema = z.object({
  AND: z.union([z.lazy(() => DataSourceWhereInputObjectSchema), z.lazy(() => DataSourceWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => DataSourceWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => DataSourceWhereInputObjectSchema), z.lazy(() => DataSourceWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  data: z.lazy(() => JsonFilterObjectSchema).optional(),
  rules: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  publish: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  isTrasposed: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  remoteUrl: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  isRemote: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  userId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  user: z.union([z.lazy(() => UserScalarRelationFilterObjectSchema), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  SourceLink: z.lazy(() => SourceLinkListRelationFilterObjectSchema).optional()
}).strict();
export const DataSourceWhereInputObjectSchema: z.ZodType<Prisma.DataSourceWhereInput> = datasourcewhereinputSchema as unknown as z.ZodType<Prisma.DataSourceWhereInput>;
export const DataSourceWhereInputObjectZodSchema = datasourcewhereinputSchema;
