import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { IntWithAggregatesFilterObjectSchema as IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const codescalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => CodeScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => CodeScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => CodeScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => CodeScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => CodeScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  code: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  expire: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  userId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const CodeScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.CodeScalarWhereWithAggregatesInput> = codescalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.CodeScalarWhereWithAggregatesInput>;
export const CodeScalarWhereWithAggregatesInputObjectZodSchema = codescalarwherewithaggregatesinputSchema;
