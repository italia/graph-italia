import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SlotSelectObjectSchema as SlotSelectObjectSchema } from './objects/SlotSelect.schema';
import { SlotCreateManyInputObjectSchema as SlotCreateManyInputObjectSchema } from './objects/SlotCreateManyInput.schema';

export const SlotCreateManyAndReturnSchema: z.ZodType<Prisma.SlotCreateManyAndReturnArgs> = z.object({ select: SlotSelectObjectSchema.optional(), data: z.union([ SlotCreateManyInputObjectSchema, z.array(SlotCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.SlotCreateManyAndReturnArgs>;

export const SlotCreateManyAndReturnZodSchema = z.object({ select: SlotSelectObjectSchema.optional(), data: z.union([ SlotCreateManyInputObjectSchema, z.array(SlotCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();