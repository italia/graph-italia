import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CodeSelectObjectSchema as CodeSelectObjectSchema } from './objects/CodeSelect.schema';
import { CodeUpdateManyMutationInputObjectSchema as CodeUpdateManyMutationInputObjectSchema } from './objects/CodeUpdateManyMutationInput.schema';
import { CodeWhereInputObjectSchema as CodeWhereInputObjectSchema } from './objects/CodeWhereInput.schema';

export const CodeUpdateManyAndReturnSchema: z.ZodType<Prisma.CodeUpdateManyAndReturnArgs> = z.object({ select: CodeSelectObjectSchema.optional(), data: CodeUpdateManyMutationInputObjectSchema, where: CodeWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.CodeUpdateManyAndReturnArgs>;

export const CodeUpdateManyAndReturnZodSchema = z.object({ select: CodeSelectObjectSchema.optional(), data: CodeUpdateManyMutationInputObjectSchema, where: CodeWhereInputObjectSchema.optional() }).strict();