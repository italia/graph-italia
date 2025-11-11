import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  code: z.string(),
  expire: z.number().int().optional(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const CodeCreateManyInputObjectSchema: z.ZodType<Prisma.CodeCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.CodeCreateManyInput>;
export const CodeCreateManyInputObjectZodSchema = makeSchema();
