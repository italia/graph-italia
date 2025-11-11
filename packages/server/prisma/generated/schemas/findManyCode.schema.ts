import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CodeIncludeObjectSchema as CodeIncludeObjectSchema } from './objects/CodeInclude.schema';
import { CodeOrderByWithRelationInputObjectSchema as CodeOrderByWithRelationInputObjectSchema } from './objects/CodeOrderByWithRelationInput.schema';
import { CodeWhereInputObjectSchema as CodeWhereInputObjectSchema } from './objects/CodeWhereInput.schema';
import { CodeWhereUniqueInputObjectSchema as CodeWhereUniqueInputObjectSchema } from './objects/CodeWhereUniqueInput.schema';
import { CodeScalarFieldEnumSchema } from './enums/CodeScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const CodeFindManySelectSchema: z.ZodType<Prisma.CodeSelect> = z.object({
    id: z.boolean().optional(),
    code: z.boolean().optional(),
    expire: z.boolean().optional(),
    user: z.boolean().optional(),
    userId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.CodeSelect>;

export const CodeFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    code: z.boolean().optional(),
    expire: z.boolean().optional(),
    user: z.boolean().optional(),
    userId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict();

export const CodeFindManySchema: z.ZodType<Prisma.CodeFindManyArgs> = z.object({ select: CodeFindManySelectSchema.optional(), include: z.lazy(() => CodeIncludeObjectSchema.optional()), orderBy: z.union([CodeOrderByWithRelationInputObjectSchema, CodeOrderByWithRelationInputObjectSchema.array()]).optional(), where: CodeWhereInputObjectSchema.optional(), cursor: CodeWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([CodeScalarFieldEnumSchema, CodeScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.CodeFindManyArgs>;

export const CodeFindManyZodSchema = z.object({ select: CodeFindManySelectSchema.optional(), include: z.lazy(() => CodeIncludeObjectSchema.optional()), orderBy: z.union([CodeOrderByWithRelationInputObjectSchema, CodeOrderByWithRelationInputObjectSchema.array()]).optional(), where: CodeWhereInputObjectSchema.optional(), cursor: CodeWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([CodeScalarFieldEnumSchema, CodeScalarFieldEnumSchema.array()]).optional() }).strict();