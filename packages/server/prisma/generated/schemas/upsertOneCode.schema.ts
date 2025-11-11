import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CodeSelectObjectSchema as CodeSelectObjectSchema } from './objects/CodeSelect.schema';
import { CodeIncludeObjectSchema as CodeIncludeObjectSchema } from './objects/CodeInclude.schema';
import { CodeWhereUniqueInputObjectSchema as CodeWhereUniqueInputObjectSchema } from './objects/CodeWhereUniqueInput.schema';
import { CodeCreateInputObjectSchema as CodeCreateInputObjectSchema } from './objects/CodeCreateInput.schema';
import { CodeUncheckedCreateInputObjectSchema as CodeUncheckedCreateInputObjectSchema } from './objects/CodeUncheckedCreateInput.schema';
import { CodeUpdateInputObjectSchema as CodeUpdateInputObjectSchema } from './objects/CodeUpdateInput.schema';
import { CodeUncheckedUpdateInputObjectSchema as CodeUncheckedUpdateInputObjectSchema } from './objects/CodeUncheckedUpdateInput.schema';

export const CodeUpsertOneSchema: z.ZodType<Prisma.CodeUpsertArgs> = z.object({ select: CodeSelectObjectSchema.optional(), include: CodeIncludeObjectSchema.optional(), where: CodeWhereUniqueInputObjectSchema, create: z.union([ CodeCreateInputObjectSchema, CodeUncheckedCreateInputObjectSchema ]), update: z.union([ CodeUpdateInputObjectSchema, CodeUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.CodeUpsertArgs>;

export const CodeUpsertOneZodSchema = z.object({ select: CodeSelectObjectSchema.optional(), include: CodeIncludeObjectSchema.optional(), where: CodeWhereUniqueInputObjectSchema, create: z.union([ CodeCreateInputObjectSchema, CodeUncheckedCreateInputObjectSchema ]), update: z.union([ CodeUpdateInputObjectSchema, CodeUncheckedUpdateInputObjectSchema ]) }).strict();