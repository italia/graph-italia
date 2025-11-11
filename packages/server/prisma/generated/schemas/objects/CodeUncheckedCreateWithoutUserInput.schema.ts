import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  code: z.string(),
  expire: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const CodeUncheckedCreateWithoutUserInputObjectSchema: z.ZodType<Prisma.CodeUncheckedCreateWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.CodeUncheckedCreateWithoutUserInput>;
export const CodeUncheckedCreateWithoutUserInputObjectZodSchema = makeSchema();
