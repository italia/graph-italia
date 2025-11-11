import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ChartIncludeObjectSchema as ChartIncludeObjectSchema } from './objects/ChartInclude.schema';
import { ChartOrderByWithRelationInputObjectSchema as ChartOrderByWithRelationInputObjectSchema } from './objects/ChartOrderByWithRelationInput.schema';
import { ChartWhereInputObjectSchema as ChartWhereInputObjectSchema } from './objects/ChartWhereInput.schema';
import { ChartWhereUniqueInputObjectSchema as ChartWhereUniqueInputObjectSchema } from './objects/ChartWhereUniqueInput.schema';
import { ChartScalarFieldEnumSchema } from './enums/ChartScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const ChartFindFirstSelectSchema: z.ZodType<Prisma.ChartSelect> = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    description: z.boolean().optional(),
    chart: z.boolean().optional(),
    config: z.boolean().optional(),
    data: z.boolean().optional(),
    publish: z.boolean().optional(),
    remoteUrl: z.boolean().optional(),
    isRemote: z.boolean().optional(),
    preview: z.boolean().optional(),
    user: z.boolean().optional(),
    userId: z.boolean().optional(),
    slot: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    SourceLink: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.ChartSelect>;

export const ChartFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    description: z.boolean().optional(),
    chart: z.boolean().optional(),
    config: z.boolean().optional(),
    data: z.boolean().optional(),
    publish: z.boolean().optional(),
    remoteUrl: z.boolean().optional(),
    isRemote: z.boolean().optional(),
    preview: z.boolean().optional(),
    user: z.boolean().optional(),
    userId: z.boolean().optional(),
    slot: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    SourceLink: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const ChartFindFirstSchema: z.ZodType<Prisma.ChartFindFirstArgs> = z.object({ select: ChartFindFirstSelectSchema.optional(), include: z.lazy(() => ChartIncludeObjectSchema.optional()), orderBy: z.union([ChartOrderByWithRelationInputObjectSchema, ChartOrderByWithRelationInputObjectSchema.array()]).optional(), where: ChartWhereInputObjectSchema.optional(), cursor: ChartWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ChartScalarFieldEnumSchema, ChartScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.ChartFindFirstArgs>;

export const ChartFindFirstZodSchema = z.object({ select: ChartFindFirstSelectSchema.optional(), include: z.lazy(() => ChartIncludeObjectSchema.optional()), orderBy: z.union([ChartOrderByWithRelationInputObjectSchema, ChartOrderByWithRelationInputObjectSchema.array()]).optional(), where: ChartWhereInputObjectSchema.optional(), cursor: ChartWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ChartScalarFieldEnumSchema, ChartScalarFieldEnumSchema.array()]).optional() }).strict();