import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { DataSourceOrderByWithRelationInputObjectSchema as DataSourceOrderByWithRelationInputObjectSchema } from './objects/DataSourceOrderByWithRelationInput.schema';
import { DataSourceWhereInputObjectSchema as DataSourceWhereInputObjectSchema } from './objects/DataSourceWhereInput.schema';
import { DataSourceWhereUniqueInputObjectSchema as DataSourceWhereUniqueInputObjectSchema } from './objects/DataSourceWhereUniqueInput.schema';
import { DataSourceCountAggregateInputObjectSchema as DataSourceCountAggregateInputObjectSchema } from './objects/DataSourceCountAggregateInput.schema';

export const DataSourceCountSchema: z.ZodType<Prisma.DataSourceCountArgs> = z.object({ orderBy: z.union([DataSourceOrderByWithRelationInputObjectSchema, DataSourceOrderByWithRelationInputObjectSchema.array()]).optional(), where: DataSourceWhereInputObjectSchema.optional(), cursor: DataSourceWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), DataSourceCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.DataSourceCountArgs>;

export const DataSourceCountZodSchema = z.object({ orderBy: z.union([DataSourceOrderByWithRelationInputObjectSchema, DataSourceOrderByWithRelationInputObjectSchema.array()]).optional(), where: DataSourceWhereInputObjectSchema.optional(), cursor: DataSourceWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), DataSourceCountAggregateInputObjectSchema ]).optional() }).strict();