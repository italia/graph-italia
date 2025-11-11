import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { DashboardOrderByWithRelationInputObjectSchema as DashboardOrderByWithRelationInputObjectSchema } from './objects/DashboardOrderByWithRelationInput.schema';
import { DashboardWhereInputObjectSchema as DashboardWhereInputObjectSchema } from './objects/DashboardWhereInput.schema';
import { DashboardWhereUniqueInputObjectSchema as DashboardWhereUniqueInputObjectSchema } from './objects/DashboardWhereUniqueInput.schema';
import { DashboardCountAggregateInputObjectSchema as DashboardCountAggregateInputObjectSchema } from './objects/DashboardCountAggregateInput.schema';

export const DashboardCountSchema: z.ZodType<Prisma.DashboardCountArgs> = z.object({ orderBy: z.union([DashboardOrderByWithRelationInputObjectSchema, DashboardOrderByWithRelationInputObjectSchema.array()]).optional(), where: DashboardWhereInputObjectSchema.optional(), cursor: DashboardWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), DashboardCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.DashboardCountArgs>;

export const DashboardCountZodSchema = z.object({ orderBy: z.union([DashboardOrderByWithRelationInputObjectSchema, DashboardOrderByWithRelationInputObjectSchema.array()]).optional(), where: DashboardWhereInputObjectSchema.optional(), cursor: DashboardWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), DashboardCountAggregateInputObjectSchema ]).optional() }).strict();