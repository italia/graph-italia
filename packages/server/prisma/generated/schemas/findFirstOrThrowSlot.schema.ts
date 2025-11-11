import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SlotIncludeObjectSchema as SlotIncludeObjectSchema } from './objects/SlotInclude.schema';
import { SlotOrderByWithRelationInputObjectSchema as SlotOrderByWithRelationInputObjectSchema } from './objects/SlotOrderByWithRelationInput.schema';
import { SlotWhereInputObjectSchema as SlotWhereInputObjectSchema } from './objects/SlotWhereInput.schema';
import { SlotWhereUniqueInputObjectSchema as SlotWhereUniqueInputObjectSchema } from './objects/SlotWhereUniqueInput.schema';
import { SlotScalarFieldEnumSchema } from './enums/SlotScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const SlotFindFirstOrThrowSelectSchema: z.ZodType<Prisma.SlotSelect> = z.object({
    dashboard: z.boolean().optional(),
    dashboardId: z.boolean().optional(),
    chart: z.boolean().optional(),
    chartId: z.boolean().optional(),
    settings: z.boolean().optional(),
    name: z.boolean().optional(),
    description: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.SlotSelect>;

export const SlotFindFirstOrThrowSelectZodSchema = z.object({
    dashboard: z.boolean().optional(),
    dashboardId: z.boolean().optional(),
    chart: z.boolean().optional(),
    chartId: z.boolean().optional(),
    settings: z.boolean().optional(),
    name: z.boolean().optional(),
    description: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict();

export const SlotFindFirstOrThrowSchema: z.ZodType<Prisma.SlotFindFirstOrThrowArgs> = z.object({ select: SlotFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => SlotIncludeObjectSchema.optional()), orderBy: z.union([SlotOrderByWithRelationInputObjectSchema, SlotOrderByWithRelationInputObjectSchema.array()]).optional(), where: SlotWhereInputObjectSchema.optional(), cursor: SlotWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([SlotScalarFieldEnumSchema, SlotScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.SlotFindFirstOrThrowArgs>;

export const SlotFindFirstOrThrowZodSchema = z.object({ select: SlotFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => SlotIncludeObjectSchema.optional()), orderBy: z.union([SlotOrderByWithRelationInputObjectSchema, SlotOrderByWithRelationInputObjectSchema.array()]).optional(), where: SlotWhereInputObjectSchema.optional(), cursor: SlotWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([SlotScalarFieldEnumSchema, SlotScalarFieldEnumSchema.array()]).optional() }).strict();