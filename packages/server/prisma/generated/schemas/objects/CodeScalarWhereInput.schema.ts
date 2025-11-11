import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const codescalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => CodeScalarWhereInputObjectSchema), z.lazy(() => CodeScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => CodeScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => CodeScalarWhereInputObjectSchema), z.lazy(() => CodeScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  code: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  expire: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  userId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const CodeScalarWhereInputObjectSchema: z.ZodType<Prisma.CodeScalarWhereInput> = codescalarwhereinputSchema as unknown as z.ZodType<Prisma.CodeScalarWhereInput>;
export const CodeScalarWhereInputObjectZodSchema = codescalarwhereinputSchema;
