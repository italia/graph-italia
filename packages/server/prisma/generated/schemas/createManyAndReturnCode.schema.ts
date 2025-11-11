import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CodeSelectObjectSchema as CodeSelectObjectSchema } from './objects/CodeSelect.schema';
import { CodeCreateManyInputObjectSchema as CodeCreateManyInputObjectSchema } from './objects/CodeCreateManyInput.schema';

export const CodeCreateManyAndReturnSchema: z.ZodType<Prisma.CodeCreateManyAndReturnArgs> = z.object({ select: CodeSelectObjectSchema.optional(), data: z.union([ CodeCreateManyInputObjectSchema, z.array(CodeCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.CodeCreateManyAndReturnArgs>;

export const CodeCreateManyAndReturnZodSchema = z.object({ select: CodeSelectObjectSchema.optional(), data: z.union([ CodeCreateManyInputObjectSchema, z.array(CodeCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();