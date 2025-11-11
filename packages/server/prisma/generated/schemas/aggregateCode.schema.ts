import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CodeOrderByWithRelationInputObjectSchema as CodeOrderByWithRelationInputObjectSchema } from './objects/CodeOrderByWithRelationInput.schema';
import { CodeWhereInputObjectSchema as CodeWhereInputObjectSchema } from './objects/CodeWhereInput.schema';
import { CodeWhereUniqueInputObjectSchema as CodeWhereUniqueInputObjectSchema } from './objects/CodeWhereUniqueInput.schema';
import { CodeCountAggregateInputObjectSchema as CodeCountAggregateInputObjectSchema } from './objects/CodeCountAggregateInput.schema';
import { CodeMinAggregateInputObjectSchema as CodeMinAggregateInputObjectSchema } from './objects/CodeMinAggregateInput.schema';
import { CodeMaxAggregateInputObjectSchema as CodeMaxAggregateInputObjectSchema } from './objects/CodeMaxAggregateInput.schema';
import { CodeAvgAggregateInputObjectSchema as CodeAvgAggregateInputObjectSchema } from './objects/CodeAvgAggregateInput.schema';
import { CodeSumAggregateInputObjectSchema as CodeSumAggregateInputObjectSchema } from './objects/CodeSumAggregateInput.schema';

export const CodeAggregateSchema: z.ZodType<Prisma.CodeAggregateArgs> = z.object({ orderBy: z.union([CodeOrderByWithRelationInputObjectSchema, CodeOrderByWithRelationInputObjectSchema.array()]).optional(), where: CodeWhereInputObjectSchema.optional(), cursor: CodeWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), CodeCountAggregateInputObjectSchema ]).optional(), _min: CodeMinAggregateInputObjectSchema.optional(), _max: CodeMaxAggregateInputObjectSchema.optional(), _avg: CodeAvgAggregateInputObjectSchema.optional(), _sum: CodeSumAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.CodeAggregateArgs>;

export const CodeAggregateZodSchema = z.object({ orderBy: z.union([CodeOrderByWithRelationInputObjectSchema, CodeOrderByWithRelationInputObjectSchema.array()]).optional(), where: CodeWhereInputObjectSchema.optional(), cursor: CodeWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), CodeCountAggregateInputObjectSchema ]).optional(), _min: CodeMinAggregateInputObjectSchema.optional(), _max: CodeMaxAggregateInputObjectSchema.optional(), _avg: CodeAvgAggregateInputObjectSchema.optional(), _sum: CodeSumAggregateInputObjectSchema.optional() }).strict();