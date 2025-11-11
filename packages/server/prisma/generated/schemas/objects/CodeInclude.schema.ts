import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserArgsObjectSchema as UserArgsObjectSchema } from './UserArgs.schema'

const makeSchema = () => z.object({
  user: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional()
}).strict();
export const CodeIncludeObjectSchema: z.ZodType<Prisma.CodeInclude> = makeSchema() as unknown as z.ZodType<Prisma.CodeInclude>;
export const CodeIncludeObjectZodSchema = makeSchema();
