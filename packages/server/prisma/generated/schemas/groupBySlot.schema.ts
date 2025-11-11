import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SlotWhereInputObjectSchema as SlotWhereInputObjectSchema } from './objects/SlotWhereInput.schema';
import { SlotOrderByWithAggregationInputObjectSchema as SlotOrderByWithAggregationInputObjectSchema } from './objects/SlotOrderByWithAggregationInput.schema';
import { SlotScalarWhereWithAggregatesInputObjectSchema as SlotScalarWhereWithAggregatesInputObjectSchema } from './objects/SlotScalarWhereWithAggregatesInput.schema';
import { SlotScalarFieldEnumSchema } from './enums/SlotScalarFieldEnum.schema';
import { SlotCountAggregateInputObjectSchema as SlotCountAggregateInputObjectSchema } from './objects/SlotCountAggregateInput.schema';
import { SlotMinAggregateInputObjectSchema as SlotMinAggregateInputObjectSchema } from './objects/SlotMinAggregateInput.schema';
import { SlotMaxAggregateInputObjectSchema as SlotMaxAggregateInputObjectSchema } from './objects/SlotMaxAggregateInput.schema';

export const SlotGroupBySchema: z.ZodType<Prisma.SlotGroupByArgs> = z.object({ where: SlotWhereInputObjectSchema.optional(), orderBy: z.union([SlotOrderByWithAggregationInputObjectSchema, SlotOrderByWithAggregationInputObjectSchema.array()]).optional(), having: SlotScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(SlotScalarFieldEnumSchema), _count: z.union([ z.literal(true), SlotCountAggregateInputObjectSchema ]).optional(), _min: SlotMinAggregateInputObjectSchema.optional(), _max: SlotMaxAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.SlotGroupByArgs>;

export const SlotGroupByZodSchema = z.object({ where: SlotWhereInputObjectSchema.optional(), orderBy: z.union([SlotOrderByWithAggregationInputObjectSchema, SlotOrderByWithAggregationInputObjectSchema.array()]).optional(), having: SlotScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(SlotScalarFieldEnumSchema), _count: z.union([ z.literal(true), SlotCountAggregateInputObjectSchema ]).optional(), _min: SlotMinAggregateInputObjectSchema.optional(), _max: SlotMaxAggregateInputObjectSchema.optional() }).strict();