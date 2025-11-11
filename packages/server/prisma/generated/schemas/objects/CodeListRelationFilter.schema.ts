import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CodeWhereInputObjectSchema as CodeWhereInputObjectSchema } from './CodeWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => CodeWhereInputObjectSchema).optional(),
  some: z.lazy(() => CodeWhereInputObjectSchema).optional(),
  none: z.lazy(() => CodeWhereInputObjectSchema).optional()
}).strict();
export const CodeListRelationFilterObjectSchema: z.ZodType<Prisma.CodeListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.CodeListRelationFilter>;
export const CodeListRelationFilterObjectZodSchema = makeSchema();
