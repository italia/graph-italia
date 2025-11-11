import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ChartOrderByWithRelationInputObjectSchema as ChartOrderByWithRelationInputObjectSchema } from './objects/ChartOrderByWithRelationInput.schema';
import { ChartWhereInputObjectSchema as ChartWhereInputObjectSchema } from './objects/ChartWhereInput.schema';
import { ChartWhereUniqueInputObjectSchema as ChartWhereUniqueInputObjectSchema } from './objects/ChartWhereUniqueInput.schema';
import { ChartCountAggregateInputObjectSchema as ChartCountAggregateInputObjectSchema } from './objects/ChartCountAggregateInput.schema';

export const ChartCountSchema: z.ZodType<Prisma.ChartCountArgs> = z.object({ orderBy: z.union([ChartOrderByWithRelationInputObjectSchema, ChartOrderByWithRelationInputObjectSchema.array()]).optional(), where: ChartWhereInputObjectSchema.optional(), cursor: ChartWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), ChartCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.ChartCountArgs>;

export const ChartCountZodSchema = z.object({ orderBy: z.union([ChartOrderByWithRelationInputObjectSchema, ChartOrderByWithRelationInputObjectSchema.array()]).optional(), where: ChartWhereInputObjectSchema.optional(), cursor: ChartWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), ChartCountAggregateInputObjectSchema ]).optional() }).strict();