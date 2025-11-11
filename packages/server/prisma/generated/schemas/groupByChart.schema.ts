import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ChartWhereInputObjectSchema as ChartWhereInputObjectSchema } from './objects/ChartWhereInput.schema';
import { ChartOrderByWithAggregationInputObjectSchema as ChartOrderByWithAggregationInputObjectSchema } from './objects/ChartOrderByWithAggregationInput.schema';
import { ChartScalarWhereWithAggregatesInputObjectSchema as ChartScalarWhereWithAggregatesInputObjectSchema } from './objects/ChartScalarWhereWithAggregatesInput.schema';
import { ChartScalarFieldEnumSchema } from './enums/ChartScalarFieldEnum.schema';
import { ChartCountAggregateInputObjectSchema as ChartCountAggregateInputObjectSchema } from './objects/ChartCountAggregateInput.schema';
import { ChartMinAggregateInputObjectSchema as ChartMinAggregateInputObjectSchema } from './objects/ChartMinAggregateInput.schema';
import { ChartMaxAggregateInputObjectSchema as ChartMaxAggregateInputObjectSchema } from './objects/ChartMaxAggregateInput.schema';

export const ChartGroupBySchema: z.ZodType<Prisma.ChartGroupByArgs> = z.object({ where: ChartWhereInputObjectSchema.optional(), orderBy: z.union([ChartOrderByWithAggregationInputObjectSchema, ChartOrderByWithAggregationInputObjectSchema.array()]).optional(), having: ChartScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(ChartScalarFieldEnumSchema), _count: z.union([ z.literal(true), ChartCountAggregateInputObjectSchema ]).optional(), _min: ChartMinAggregateInputObjectSchema.optional(), _max: ChartMaxAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ChartGroupByArgs>;

export const ChartGroupByZodSchema = z.object({ where: ChartWhereInputObjectSchema.optional(), orderBy: z.union([ChartOrderByWithAggregationInputObjectSchema, ChartOrderByWithAggregationInputObjectSchema.array()]).optional(), having: ChartScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(ChartScalarFieldEnumSchema), _count: z.union([ z.literal(true), ChartCountAggregateInputObjectSchema ]).optional(), _min: ChartMinAggregateInputObjectSchema.optional(), _max: ChartMaxAggregateInputObjectSchema.optional() }).strict();