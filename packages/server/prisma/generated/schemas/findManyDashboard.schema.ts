import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { DashboardIncludeObjectSchema as DashboardIncludeObjectSchema } from './objects/DashboardInclude.schema';
import { DashboardOrderByWithRelationInputObjectSchema as DashboardOrderByWithRelationInputObjectSchema } from './objects/DashboardOrderByWithRelationInput.schema';
import { DashboardWhereInputObjectSchema as DashboardWhereInputObjectSchema } from './objects/DashboardWhereInput.schema';
import { DashboardWhereUniqueInputObjectSchema as DashboardWhereUniqueInputObjectSchema } from './objects/DashboardWhereUniqueInput.schema';
import { DashboardScalarFieldEnumSchema } from './enums/DashboardScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const DashboardFindManySelectSchema: z.ZodType<Prisma.DashboardSelect> = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    description: z.boolean().optional(),
    publish: z.boolean().optional(),
    user: z.boolean().optional(),
    userId: z.boolean().optional(),
    slots: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.DashboardSelect>;

export const DashboardFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    description: z.boolean().optional(),
    publish: z.boolean().optional(),
    user: z.boolean().optional(),
    userId: z.boolean().optional(),
    slots: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const DashboardFindManySchema: z.ZodType<Prisma.DashboardFindManyArgs> = z.object({ select: DashboardFindManySelectSchema.optional(), include: z.lazy(() => DashboardIncludeObjectSchema.optional()), orderBy: z.union([DashboardOrderByWithRelationInputObjectSchema, DashboardOrderByWithRelationInputObjectSchema.array()]).optional(), where: DashboardWhereInputObjectSchema.optional(), cursor: DashboardWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([DashboardScalarFieldEnumSchema, DashboardScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.DashboardFindManyArgs>;

export const DashboardFindManyZodSchema = z.object({ select: DashboardFindManySelectSchema.optional(), include: z.lazy(() => DashboardIncludeObjectSchema.optional()), orderBy: z.union([DashboardOrderByWithRelationInputObjectSchema, DashboardOrderByWithRelationInputObjectSchema.array()]).optional(), where: DashboardWhereInputObjectSchema.optional(), cursor: DashboardWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([DashboardScalarFieldEnumSchema, DashboardScalarFieldEnumSchema.array()]).optional() }).strict();