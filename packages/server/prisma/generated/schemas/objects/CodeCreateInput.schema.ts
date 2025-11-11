import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateNestedOneWithoutCodeInputObjectSchema as UserCreateNestedOneWithoutCodeInputObjectSchema } from './UserCreateNestedOneWithoutCodeInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  code: z.string(),
  expire: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutCodeInputObjectSchema)
}).strict();
export const CodeCreateInputObjectSchema: z.ZodType<Prisma.CodeCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.CodeCreateInput>;
export const CodeCreateInputObjectZodSchema = makeSchema();
