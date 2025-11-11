import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CodeWhereInputObjectSchema as CodeWhereInputObjectSchema } from './objects/CodeWhereInput.schema';

export const CodeDeleteManySchema: z.ZodType<Prisma.CodeDeleteManyArgs> = z.object({ where: CodeWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.CodeDeleteManyArgs>;

export const CodeDeleteManyZodSchema = z.object({ where: CodeWhereInputObjectSchema.optional() }).strict();