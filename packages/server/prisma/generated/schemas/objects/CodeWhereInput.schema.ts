import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { UserScalarRelationFilterObjectSchema as UserScalarRelationFilterObjectSchema } from './UserScalarRelationFilter.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema'

const codewhereinputSchema = z.object({
  AND: z.union([z.lazy(() => CodeWhereInputObjectSchema), z.lazy(() => CodeWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => CodeWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => CodeWhereInputObjectSchema), z.lazy(() => CodeWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  code: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  expire: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  userId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  user: z.union([z.lazy(() => UserScalarRelationFilterObjectSchema), z.lazy(() => UserWhereInputObjectSchema)]).optional()
}).strict();
export const CodeWhereInputObjectSchema: z.ZodType<Prisma.CodeWhereInput> = codewhereinputSchema as unknown as z.ZodType<Prisma.CodeWhereInput>;
export const CodeWhereInputObjectZodSchema = codewhereinputSchema;
