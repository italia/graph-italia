import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CodeOrderByWithRelationInputObjectSchema as CodeOrderByWithRelationInputObjectSchema } from './objects/CodeOrderByWithRelationInput.schema';
import { CodeWhereInputObjectSchema as CodeWhereInputObjectSchema } from './objects/CodeWhereInput.schema';
import { CodeWhereUniqueInputObjectSchema as CodeWhereUniqueInputObjectSchema } from './objects/CodeWhereUniqueInput.schema';
import { CodeCountAggregateInputObjectSchema as CodeCountAggregateInputObjectSchema } from './objects/CodeCountAggregateInput.schema';

export const CodeCountSchema: z.ZodType<Prisma.CodeCountArgs> = z.object({ orderBy: z.union([CodeOrderByWithRelationInputObjectSchema, CodeOrderByWithRelationInputObjectSchema.array()]).optional(), where: CodeWhereInputObjectSchema.optional(), cursor: CodeWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), CodeCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.CodeCountArgs>;

export const CodeCountZodSchema = z.object({ orderBy: z.union([CodeOrderByWithRelationInputObjectSchema, CodeOrderByWithRelationInputObjectSchema.array()]).optional(), where: CodeWhereInputObjectSchema.optional(), cursor: CodeWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), CodeCountAggregateInputObjectSchema ]).optional() }).strict();