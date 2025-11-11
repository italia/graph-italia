import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SlotOrderByWithRelationInputObjectSchema as SlotOrderByWithRelationInputObjectSchema } from './objects/SlotOrderByWithRelationInput.schema';
import { SlotWhereInputObjectSchema as SlotWhereInputObjectSchema } from './objects/SlotWhereInput.schema';
import { SlotWhereUniqueInputObjectSchema as SlotWhereUniqueInputObjectSchema } from './objects/SlotWhereUniqueInput.schema';
import { SlotCountAggregateInputObjectSchema as SlotCountAggregateInputObjectSchema } from './objects/SlotCountAggregateInput.schema';
import { SlotMinAggregateInputObjectSchema as SlotMinAggregateInputObjectSchema } from './objects/SlotMinAggregateInput.schema';
import { SlotMaxAggregateInputObjectSchema as SlotMaxAggregateInputObjectSchema } from './objects/SlotMaxAggregateInput.schema';

export const SlotAggregateSchema: z.ZodType<Prisma.SlotAggregateArgs> = z.object({ orderBy: z.union([SlotOrderByWithRelationInputObjectSchema, SlotOrderByWithRelationInputObjectSchema.array()]).optional(), where: SlotWhereInputObjectSchema.optional(), cursor: SlotWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), SlotCountAggregateInputObjectSchema ]).optional(), _min: SlotMinAggregateInputObjectSchema.optional(), _max: SlotMaxAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.SlotAggregateArgs>;

export const SlotAggregateZodSchema = z.object({ orderBy: z.union([SlotOrderByWithRelationInputObjectSchema, SlotOrderByWithRelationInputObjectSchema.array()]).optional(), where: SlotWhereInputObjectSchema.optional(), cursor: SlotWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), SlotCountAggregateInputObjectSchema ]).optional(), _min: SlotMinAggregateInputObjectSchema.optional(), _max: SlotMaxAggregateInputObjectSchema.optional() }).strict();