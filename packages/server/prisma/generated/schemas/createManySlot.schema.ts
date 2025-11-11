import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SlotCreateManyInputObjectSchema as SlotCreateManyInputObjectSchema } from './objects/SlotCreateManyInput.schema';

export const SlotCreateManySchema: z.ZodType<Prisma.SlotCreateManyArgs> = z.object({ data: z.union([ SlotCreateManyInputObjectSchema, z.array(SlotCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.SlotCreateManyArgs>;

export const SlotCreateManyZodSchema = z.object({ data: z.union([ SlotCreateManyInputObjectSchema, z.array(SlotCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();