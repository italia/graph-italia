import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CodeSelectObjectSchema as CodeSelectObjectSchema } from './objects/CodeSelect.schema';
import { CodeIncludeObjectSchema as CodeIncludeObjectSchema } from './objects/CodeInclude.schema';
import { CodeWhereUniqueInputObjectSchema as CodeWhereUniqueInputObjectSchema } from './objects/CodeWhereUniqueInput.schema';

export const CodeFindUniqueOrThrowSchema: z.ZodType<Prisma.CodeFindUniqueOrThrowArgs> = z.object({ select: CodeSelectObjectSchema.optional(), include: CodeIncludeObjectSchema.optional(), where: CodeWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.CodeFindUniqueOrThrowArgs>;

export const CodeFindUniqueOrThrowZodSchema = z.object({ select: CodeSelectObjectSchema.optional(), include: CodeIncludeObjectSchema.optional(), where: CodeWhereUniqueInputObjectSchema }).strict();