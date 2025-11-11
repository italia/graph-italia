import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CodeWhereInputObjectSchema as CodeWhereInputObjectSchema } from './objects/CodeWhereInput.schema';
import { CodeOrderByWithAggregationInputObjectSchema as CodeOrderByWithAggregationInputObjectSchema } from './objects/CodeOrderByWithAggregationInput.schema';
import { CodeScalarWhereWithAggregatesInputObjectSchema as CodeScalarWhereWithAggregatesInputObjectSchema } from './objects/CodeScalarWhereWithAggregatesInput.schema';
import { CodeScalarFieldEnumSchema } from './enums/CodeScalarFieldEnum.schema';
import { CodeCountAggregateInputObjectSchema as CodeCountAggregateInputObjectSchema } from './objects/CodeCountAggregateInput.schema';
import { CodeMinAggregateInputObjectSchema as CodeMinAggregateInputObjectSchema } from './objects/CodeMinAggregateInput.schema';
import { CodeMaxAggregateInputObjectSchema as CodeMaxAggregateInputObjectSchema } from './objects/CodeMaxAggregateInput.schema';
import { CodeAvgAggregateInputObjectSchema as CodeAvgAggregateInputObjectSchema } from './objects/CodeAvgAggregateInput.schema';
import { CodeSumAggregateInputObjectSchema as CodeSumAggregateInputObjectSchema } from './objects/CodeSumAggregateInput.schema';

export const CodeGroupBySchema: z.ZodType<Prisma.CodeGroupByArgs> = z.object({ where: CodeWhereInputObjectSchema.optional(), orderBy: z.union([CodeOrderByWithAggregationInputObjectSchema, CodeOrderByWithAggregationInputObjectSchema.array()]).optional(), having: CodeScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(CodeScalarFieldEnumSchema), _count: z.union([ z.literal(true), CodeCountAggregateInputObjectSchema ]).optional(), _min: CodeMinAggregateInputObjectSchema.optional(), _max: CodeMaxAggregateInputObjectSchema.optional(), _avg: CodeAvgAggregateInputObjectSchema.optional(), _sum: CodeSumAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.CodeGroupByArgs>;

export const CodeGroupByZodSchema = z.object({ where: CodeWhereInputObjectSchema.optional(), orderBy: z.union([CodeOrderByWithAggregationInputObjectSchema, CodeOrderByWithAggregationInputObjectSchema.array()]).optional(), having: CodeScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(CodeScalarFieldEnumSchema), _count: z.union([ z.literal(true), CodeCountAggregateInputObjectSchema ]).optional(), _min: CodeMinAggregateInputObjectSchema.optional(), _max: CodeMaxAggregateInputObjectSchema.optional(), _avg: CodeAvgAggregateInputObjectSchema.optional(), _sum: CodeSumAggregateInputObjectSchema.optional() }).strict();