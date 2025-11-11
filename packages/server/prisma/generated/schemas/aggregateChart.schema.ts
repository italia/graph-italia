import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ChartOrderByWithRelationInputObjectSchema as ChartOrderByWithRelationInputObjectSchema } from './objects/ChartOrderByWithRelationInput.schema';
import { ChartWhereInputObjectSchema as ChartWhereInputObjectSchema } from './objects/ChartWhereInput.schema';
import { ChartWhereUniqueInputObjectSchema as ChartWhereUniqueInputObjectSchema } from './objects/ChartWhereUniqueInput.schema';
import { ChartCountAggregateInputObjectSchema as ChartCountAggregateInputObjectSchema } from './objects/ChartCountAggregateInput.schema';
import { ChartMinAggregateInputObjectSchema as ChartMinAggregateInputObjectSchema } from './objects/ChartMinAggregateInput.schema';
import { ChartMaxAggregateInputObjectSchema as ChartMaxAggregateInputObjectSchema } from './objects/ChartMaxAggregateInput.schema';

export const ChartAggregateSchema: z.ZodType<Prisma.ChartAggregateArgs> = z.object({ orderBy: z.union([ChartOrderByWithRelationInputObjectSchema, ChartOrderByWithRelationInputObjectSchema.array()]).optional(), where: ChartWhereInputObjectSchema.optional(), cursor: ChartWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), ChartCountAggregateInputObjectSchema ]).optional(), _min: ChartMinAggregateInputObjectSchema.optional(), _max: ChartMaxAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ChartAggregateArgs>;

export const ChartAggregateZodSchema = z.object({ orderBy: z.union([ChartOrderByWithRelationInputObjectSchema, ChartOrderByWithRelationInputObjectSchema.array()]).optional(), where: ChartWhereInputObjectSchema.optional(), cursor: ChartWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), ChartCountAggregateInputObjectSchema ]).optional(), _min: ChartMinAggregateInputObjectSchema.optional(), _max: ChartMaxAggregateInputObjectSchema.optional() }).strict();