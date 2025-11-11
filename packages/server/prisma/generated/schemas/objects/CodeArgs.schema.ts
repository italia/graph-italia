import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CodeSelectObjectSchema as CodeSelectObjectSchema } from './CodeSelect.schema';
import { CodeIncludeObjectSchema as CodeIncludeObjectSchema } from './CodeInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => CodeSelectObjectSchema).optional(),
  include: z.lazy(() => CodeIncludeObjectSchema).optional()
}).strict();
export const CodeArgsObjectSchema = makeSchema();
export const CodeArgsObjectZodSchema = makeSchema();
