import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { JsonNullableFilterObjectSchema as JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { UserScalarRelationFilterObjectSchema as UserScalarRelationFilterObjectSchema } from './UserScalarRelationFilter.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { SlotListRelationFilterObjectSchema as SlotListRelationFilterObjectSchema } from './SlotListRelationFilter.schema';
import { SourceLinkListRelationFilterObjectSchema as SourceLinkListRelationFilterObjectSchema } from './SourceLinkListRelationFilter.schema'

const chartwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => ChartWhereInputObjectSchema), z.lazy(() => ChartWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ChartWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ChartWhereInputObjectSchema), z.lazy(() => ChartWhereInputObjectSchema).array()]).optional(),
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
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  user: z.union([z.lazy(() => UserScalarRelationFilterObjectSchema), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  slot: z.lazy(() => SlotListRelationFilterObjectSchema).optional(),
  SourceLink: z.lazy(() => SourceLinkListRelationFilterObjectSchema).optional()
}).strict();
export const ChartWhereInputObjectSchema: z.ZodType<Prisma.ChartWhereInput> = chartwhereinputSchema as unknown as z.ZodType<Prisma.ChartWhereInput>;
export const ChartWhereInputObjectZodSchema = chartwhereinputSchema;
