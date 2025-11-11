import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CodeSelectObjectSchema as CodeSelectObjectSchema } from './objects/CodeSelect.schema';
import { CodeIncludeObjectSchema as CodeIncludeObjectSchema } from './objects/CodeInclude.schema';
import { CodeWhereUniqueInputObjectSchema as CodeWhereUniqueInputObjectSchema } from './objects/CodeWhereUniqueInput.schema';

export const CodeFindUniqueSchema: z.ZodType<Prisma.CodeFindUniqueArgs> = z.object({ select: CodeSelectObjectSchema.optional(), include: CodeIncludeObjectSchema.optional(), where: CodeWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.CodeFindUniqueArgs>;

export const CodeFindUniqueZodSchema = z.object({ select: CodeSelectObjectSchema.optional(), include: CodeIncludeObjectSchema.optional(), where: CodeWhereUniqueInputObjectSchema }).strict();