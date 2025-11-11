import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SourceLinkOrderByWithRelationInputObjectSchema as SourceLinkOrderByWithRelationInputObjectSchema } from './objects/SourceLinkOrderByWithRelationInput.schema';
import { SourceLinkWhereInputObjectSchema as SourceLinkWhereInputObjectSchema } from './objects/SourceLinkWhereInput.schema';
import { SourceLinkWhereUniqueInputObjectSchema as SourceLinkWhereUniqueInputObjectSchema } from './objects/SourceLinkWhereUniqueInput.schema';
import { SourceLinkCountAggregateInputObjectSchema as SourceLinkCountAggregateInputObjectSchema } from './objects/SourceLinkCountAggregateInput.schema';

export const SourceLinkCountSchema: z.ZodType<Prisma.SourceLinkCountArgs> = z.object({ orderBy: z.union([SourceLinkOrderByWithRelationInputObjectSchema, SourceLinkOrderByWithRelationInputObjectSchema.array()]).optional(), where: SourceLinkWhereInputObjectSchema.optional(), cursor: SourceLinkWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), SourceLinkCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.SourceLinkCountArgs>;

export const SourceLinkCountZodSchema = z.object({ orderBy: z.union([SourceLinkOrderByWithRelationInputObjectSchema, SourceLinkOrderByWithRelationInputObjectSchema.array()]).optional(), where: SourceLinkWhereInputObjectSchema.optional(), cursor: SourceLinkWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), SourceLinkCountAggregateInputObjectSchema ]).optional() }).strict();