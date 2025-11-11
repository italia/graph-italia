import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { DashboardIncludeObjectSchema as DashboardIncludeObjectSchema } from './objects/DashboardInclude.schema';
import { DashboardOrderByWithRelationInputObjectSchema as DashboardOrderByWithRelationInputObjectSchema } from './objects/DashboardOrderByWithRelationInput.schema';
import { DashboardWhereInputObjectSchema as DashboardWhereInputObjectSchema } from './objects/DashboardWhereInput.schema';
import { DashboardWhereUniqueInputObjectSchema as DashboardWhereUniqueInputObjectSchema } from './objects/DashboardWhereUniqueInput.schema';
import { DashboardScalarFieldEnumSchema } from './enums/DashboardScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const DashboardFindFirstOrThrowSelectSchema: z.ZodType<Prisma.DashboardSelect> = z.object({
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

export const DashboardFindFirstOrThrowSelectZodSchema = z.object({
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

export const DashboardFindFirstOrThrowSchema: z.ZodType<Prisma.DashboardFindFirstOrThrowArgs> = z.object({ select: DashboardFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => DashboardIncludeObjectSchema.optional()), orderBy: z.union([DashboardOrderByWithRelationInputObjectSchema, DashboardOrderByWithRelationInputObjectSchema.array()]).optional(), where: DashboardWhereInputObjectSchema.optional(), cursor: DashboardWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([DashboardScalarFieldEnumSchema, DashboardScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.DashboardFindFirstOrThrowArgs>;

export const DashboardFindFirstOrThrowZodSchema = z.object({ select: DashboardFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => DashboardIncludeObjectSchema.optional()), orderBy: z.union([DashboardOrderByWithRelationInputObjectSchema, DashboardOrderByWithRelationInputObjectSchema.array()]).optional(), where: DashboardWhereInputObjectSchema.optional(), cursor: DashboardWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([DashboardScalarFieldEnumSchema, DashboardScalarFieldEnumSchema.array()]).optional() }).strict();