import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SlotUpdateManyMutationInputObjectSchema as SlotUpdateManyMutationInputObjectSchema } from './objects/SlotUpdateManyMutationInput.schema';
import { SlotWhereInputObjectSchema as SlotWhereInputObjectSchema } from './objects/SlotWhereInput.schema';

export const SlotUpdateManySchema: z.ZodType<Prisma.SlotUpdateManyArgs> = z.object({ data: SlotUpdateManyMutationInputObjectSchema, where: SlotWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.SlotUpdateManyArgs>;

export const SlotUpdateManyZodSchema = z.object({ data: SlotUpdateManyMutationInputObjectSchema, where: SlotWhereInputObjectSchema.optional() }).strict();