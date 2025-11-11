import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SlotWhereInputObjectSchema as SlotWhereInputObjectSchema } from './objects/SlotWhereInput.schema';

export const SlotDeleteManySchema: z.ZodType<Prisma.SlotDeleteManyArgs> = z.object({ where: SlotWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.SlotDeleteManyArgs>;

export const SlotDeleteManyZodSchema = z.object({ where: SlotWhereInputObjectSchema.optional() }).strict();