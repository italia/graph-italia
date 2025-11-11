import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SlotSelectObjectSchema as SlotSelectObjectSchema } from './objects/SlotSelect.schema';
import { SlotIncludeObjectSchema as SlotIncludeObjectSchema } from './objects/SlotInclude.schema';
import { SlotUpdateInputObjectSchema as SlotUpdateInputObjectSchema } from './objects/SlotUpdateInput.schema';
import { SlotUncheckedUpdateInputObjectSchema as SlotUncheckedUpdateInputObjectSchema } from './objects/SlotUncheckedUpdateInput.schema';
import { SlotWhereUniqueInputObjectSchema as SlotWhereUniqueInputObjectSchema } from './objects/SlotWhereUniqueInput.schema';

export const SlotUpdateOneSchema: z.ZodType<Prisma.SlotUpdateArgs> = z.object({ select: SlotSelectObjectSchema.optional(), include: SlotIncludeObjectSchema.optional(), data: z.union([SlotUpdateInputObjectSchema, SlotUncheckedUpdateInputObjectSchema]), where: SlotWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.SlotUpdateArgs>;

export const SlotUpdateOneZodSchema = z.object({ select: SlotSelectObjectSchema.optional(), include: SlotIncludeObjectSchema.optional(), data: z.union([SlotUpdateInputObjectSchema, SlotUncheckedUpdateInputObjectSchema]), where: SlotWhereUniqueInputObjectSchema }).strict();