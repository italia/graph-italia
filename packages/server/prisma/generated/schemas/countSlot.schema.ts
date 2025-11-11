import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SlotOrderByWithRelationInputObjectSchema as SlotOrderByWithRelationInputObjectSchema } from './objects/SlotOrderByWithRelationInput.schema';
import { SlotWhereInputObjectSchema as SlotWhereInputObjectSchema } from './objects/SlotWhereInput.schema';
import { SlotWhereUniqueInputObjectSchema as SlotWhereUniqueInputObjectSchema } from './objects/SlotWhereUniqueInput.schema';
import { SlotCountAggregateInputObjectSchema as SlotCountAggregateInputObjectSchema } from './objects/SlotCountAggregateInput.schema';

export const SlotCountSchema: z.ZodType<Prisma.SlotCountArgs> = z.object({ orderBy: z.union([SlotOrderByWithRelationInputObjectSchema, SlotOrderByWithRelationInputObjectSchema.array()]).optional(), where: SlotWhereInputObjectSchema.optional(), cursor: SlotWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), SlotCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.SlotCountArgs>;

export const SlotCountZodSchema = z.object({ orderBy: z.union([SlotOrderByWithRelationInputObjectSchema, SlotOrderByWithRelationInputObjectSchema.array()]).optional(), where: SlotWhereInputObjectSchema.optional(), cursor: SlotWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), SlotCountAggregateInputObjectSchema ]).optional() }).strict();