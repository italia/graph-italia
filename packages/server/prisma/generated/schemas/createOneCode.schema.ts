import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CodeSelectObjectSchema as CodeSelectObjectSchema } from './objects/CodeSelect.schema';
import { CodeIncludeObjectSchema as CodeIncludeObjectSchema } from './objects/CodeInclude.schema';
import { CodeCreateInputObjectSchema as CodeCreateInputObjectSchema } from './objects/CodeCreateInput.schema';
import { CodeUncheckedCreateInputObjectSchema as CodeUncheckedCreateInputObjectSchema } from './objects/CodeUncheckedCreateInput.schema';

export const CodeCreateOneSchema: z.ZodType<Prisma.CodeCreateArgs> = z.object({ select: CodeSelectObjectSchema.optional(), include: CodeIncludeObjectSchema.optional(), data: z.union([CodeCreateInputObjectSchema, CodeUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.CodeCreateArgs>;

export const CodeCreateOneZodSchema = z.object({ select: CodeSelectObjectSchema.optional(), include: CodeIncludeObjectSchema.optional(), data: z.union([CodeCreateInputObjectSchema, CodeUncheckedCreateInputObjectSchema]) }).strict();