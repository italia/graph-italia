import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CodeSelectObjectSchema as CodeSelectObjectSchema } from './objects/CodeSelect.schema';
import { CodeIncludeObjectSchema as CodeIncludeObjectSchema } from './objects/CodeInclude.schema';
import { CodeUpdateInputObjectSchema as CodeUpdateInputObjectSchema } from './objects/CodeUpdateInput.schema';
import { CodeUncheckedUpdateInputObjectSchema as CodeUncheckedUpdateInputObjectSchema } from './objects/CodeUncheckedUpdateInput.schema';
import { CodeWhereUniqueInputObjectSchema as CodeWhereUniqueInputObjectSchema } from './objects/CodeWhereUniqueInput.schema';

export const CodeUpdateOneSchema: z.ZodType<Prisma.CodeUpdateArgs> = z.object({ select: CodeSelectObjectSchema.optional(), include: CodeIncludeObjectSchema.optional(), data: z.union([CodeUpdateInputObjectSchema, CodeUncheckedUpdateInputObjectSchema]), where: CodeWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.CodeUpdateArgs>;

export const CodeUpdateOneZodSchema = z.object({ select: CodeSelectObjectSchema.optional(), include: CodeIncludeObjectSchema.optional(), data: z.union([CodeUpdateInputObjectSchema, CodeUncheckedUpdateInputObjectSchema]), where: CodeWhereUniqueInputObjectSchema }).strict();