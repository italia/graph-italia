import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { DataSourceIncludeObjectSchema as DataSourceIncludeObjectSchema } from './objects/DataSourceInclude.schema';
import { DataSourceOrderByWithRelationInputObjectSchema as DataSourceOrderByWithRelationInputObjectSchema } from './objects/DataSourceOrderByWithRelationInput.schema';
import { DataSourceWhereInputObjectSchema as DataSourceWhereInputObjectSchema } from './objects/DataSourceWhereInput.schema';
import { DataSourceWhereUniqueInputObjectSchema as DataSourceWhereUniqueInputObjectSchema } from './objects/DataSourceWhereUniqueInput.schema';
import { DataSourceScalarFieldEnumSchema } from './enums/DataSourceScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const DataSourceFindManySelectSchema: z.ZodType<Prisma.DataSourceSelect> = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    description: z.boolean().optional(),
    data: z.boolean().optional(),
    rules: z.boolean().optional(),
    publish: z.boolean().optional(),
    isTrasposed: z.boolean().optional(),
    remoteUrl: z.boolean().optional(),
    isRemote: z.boolean().optional(),
    user: z.boolean().optional(),
    userId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    SourceLink: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.DataSourceSelect>;

export const DataSourceFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    description: z.boolean().optional(),
    data: z.boolean().optional(),
    rules: z.boolean().optional(),
    publish: z.boolean().optional(),
    isTrasposed: z.boolean().optional(),
    remoteUrl: z.boolean().optional(),
    isRemote: z.boolean().optional(),
    user: z.boolean().optional(),
    userId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    SourceLink: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const DataSourceFindManySchema: z.ZodType<Prisma.DataSourceFindManyArgs> = z.object({ select: DataSourceFindManySelectSchema.optional(), include: z.lazy(() => DataSourceIncludeObjectSchema.optional()), orderBy: z.union([DataSourceOrderByWithRelationInputObjectSchema, DataSourceOrderByWithRelationInputObjectSchema.array()]).optional(), where: DataSourceWhereInputObjectSchema.optional(), cursor: DataSourceWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([DataSourceScalarFieldEnumSchema, DataSourceScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.DataSourceFindManyArgs>;

export const DataSourceFindManyZodSchema = z.object({ select: DataSourceFindManySelectSchema.optional(), include: z.lazy(() => DataSourceIncludeObjectSchema.optional()), orderBy: z.union([DataSourceOrderByWithRelationInputObjectSchema, DataSourceOrderByWithRelationInputObjectSchema.array()]).optional(), where: DataSourceWhereInputObjectSchema.optional(), cursor: DataSourceWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([DataSourceScalarFieldEnumSchema, DataSourceScalarFieldEnumSchema.array()]).optional() }).strict();