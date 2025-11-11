import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CodeUpdateManyMutationInputObjectSchema as CodeUpdateManyMutationInputObjectSchema } from './objects/CodeUpdateManyMutationInput.schema';
import { CodeWhereInputObjectSchema as CodeWhereInputObjectSchema } from './objects/CodeWhereInput.schema';

export const CodeUpdateManySchema: z.ZodType<Prisma.CodeUpdateManyArgs> = z.object({ data: CodeUpdateManyMutationInputObjectSchema, where: CodeWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.CodeUpdateManyArgs>;

export const CodeUpdateManyZodSchema = z.object({ data: CodeUpdateManyMutationInputObjectSchema, where: CodeWhereInputObjectSchema.optional() }).strict();