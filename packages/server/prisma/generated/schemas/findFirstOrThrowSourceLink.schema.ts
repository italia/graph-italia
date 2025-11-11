import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SourceLinkIncludeObjectSchema as SourceLinkIncludeObjectSchema } from './objects/SourceLinkInclude.schema';
import { SourceLinkOrderByWithRelationInputObjectSchema as SourceLinkOrderByWithRelationInputObjectSchema } from './objects/SourceLinkOrderByWithRelationInput.schema';
import { SourceLinkWhereInputObjectSchema as SourceLinkWhereInputObjectSchema } from './objects/SourceLinkWhereInput.schema';
import { SourceLinkWhereUniqueInputObjectSchema as SourceLinkWhereUniqueInputObjectSchema } from './objects/SourceLinkWhereUniqueInput.schema';
import { SourceLinkScalarFieldEnumSchema } from './enums/SourceLinkScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const SourceLinkFindFirstOrThrowSelectSchema: z.ZodType<Prisma.SourceLinkSelect> = z.object({
    dataSource: z.boolean().optional(),
    dataSourceId: z.boolean().optional(),
    chart: z.boolean().optional(),
    chartId: z.boolean().optional(),
    config: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.SourceLinkSelect>;

export const SourceLinkFindFirstOrThrowSelectZodSchema = z.object({
    dataSource: z.boolean().optional(),
    dataSourceId: z.boolean().optional(),
    chart: z.boolean().optional(),
    chartId: z.boolean().optional(),
    config: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict();

export const SourceLinkFindFirstOrThrowSchema: z.ZodType<Prisma.SourceLinkFindFirstOrThrowArgs> = z.object({ select: SourceLinkFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => SourceLinkIncludeObjectSchema.optional()), orderBy: z.union([SourceLinkOrderByWithRelationInputObjectSchema, SourceLinkOrderByWithRelationInputObjectSchema.array()]).optional(), where: SourceLinkWhereInputObjectSchema.optional(), cursor: SourceLinkWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([SourceLinkScalarFieldEnumSchema, SourceLinkScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.SourceLinkFindFirstOrThrowArgs>;

export const SourceLinkFindFirstOrThrowZodSchema = z.object({ select: SourceLinkFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => SourceLinkIncludeObjectSchema.optional()), orderBy: z.union([SourceLinkOrderByWithRelationInputObjectSchema, SourceLinkOrderByWithRelationInputObjectSchema.array()]).optional(), where: SourceLinkWhereInputObjectSchema.optional(), cursor: SourceLinkWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([SourceLinkScalarFieldEnumSchema, SourceLinkScalarFieldEnumSchema.array()]).optional() }).strict();