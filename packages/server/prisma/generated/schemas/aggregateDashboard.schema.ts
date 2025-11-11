import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { DashboardOrderByWithRelationInputObjectSchema as DashboardOrderByWithRelationInputObjectSchema } from './objects/DashboardOrderByWithRelationInput.schema';
import { DashboardWhereInputObjectSchema as DashboardWhereInputObjectSchema } from './objects/DashboardWhereInput.schema';
import { DashboardWhereUniqueInputObjectSchema as DashboardWhereUniqueInputObjectSchema } from './objects/DashboardWhereUniqueInput.schema';
import { DashboardCountAggregateInputObjectSchema as DashboardCountAggregateInputObjectSchema } from './objects/DashboardCountAggregateInput.schema';
import { DashboardMinAggregateInputObjectSchema as DashboardMinAggregateInputObjectSchema } from './objects/DashboardMinAggregateInput.schema';
import { DashboardMaxAggregateInputObjectSchema as DashboardMaxAggregateInputObjectSchema } from './objects/DashboardMaxAggregateInput.schema';

export const DashboardAggregateSchema: z.ZodType<Prisma.DashboardAggregateArgs> = z.object({ orderBy: z.union([DashboardOrderByWithRelationInputObjectSchema, DashboardOrderByWithRelationInputObjectSchema.array()]).optional(), where: DashboardWhereInputObjectSchema.optional(), cursor: DashboardWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), DashboardCountAggregateInputObjectSchema ]).optional(), _min: DashboardMinAggregateInputObjectSchema.optional(), _max: DashboardMaxAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.DashboardAggregateArgs>;

export const DashboardAggregateZodSchema = z.object({ orderBy: z.union([DashboardOrderByWithRelationInputObjectSchema, DashboardOrderByWithRelationInputObjectSchema.array()]).optional(), where: DashboardWhereInputObjectSchema.optional(), cursor: DashboardWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), DashboardCountAggregateInputObjectSchema ]).optional(), _min: DashboardMinAggregateInputObjectSchema.optional(), _max: DashboardMaxAggregateInputObjectSchema.optional() }).strict();