import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CodeCreateManyInputObjectSchema as CodeCreateManyInputObjectSchema } from './objects/CodeCreateManyInput.schema';

export const CodeCreateManySchema: z.ZodType<Prisma.CodeCreateManyArgs> = z.object({ data: z.union([ CodeCreateManyInputObjectSchema, z.array(CodeCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.CodeCreateManyArgs>;

export const CodeCreateManyZodSchema = z.object({ data: z.union([ CodeCreateManyInputObjectSchema, z.array(CodeCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();