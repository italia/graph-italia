import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SlotSelectObjectSchema as SlotSelectObjectSchema } from './objects/SlotSelect.schema';
import { SlotIncludeObjectSchema as SlotIncludeObjectSchema } from './objects/SlotInclude.schema';
import { SlotWhereUniqueInputObjectSchema as SlotWhereUniqueInputObjectSchema } from './objects/SlotWhereUniqueInput.schema';
import { SlotCreateInputObjectSchema as SlotCreateInputObjectSchema } from './objects/SlotCreateInput.schema';
import { SlotUncheckedCreateInputObjectSchema as SlotUncheckedCreateInputObjectSchema } from './objects/SlotUncheckedCreateInput.schema';
import { SlotUpdateInputObjectSchema as SlotUpdateInputObjectSchema } from './objects/SlotUpdateInput.schema';
import { SlotUncheckedUpdateInputObjectSchema as SlotUncheckedUpdateInputObjectSchema } from './objects/SlotUncheckedUpdateInput.schema';

export const SlotUpsertOneSchema: z.ZodType<Prisma.SlotUpsertArgs> = z.object({ select: SlotSelectObjectSchema.optional(), include: SlotIncludeObjectSchema.optional(), where: SlotWhereUniqueInputObjectSchema, create: z.union([ SlotCreateInputObjectSchema, SlotUncheckedCreateInputObjectSchema ]), update: z.union([ SlotUpdateInputObjectSchema, SlotUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.SlotUpsertArgs>;

export const SlotUpsertOneZodSchema = z.object({ select: SlotSelectObjectSchema.optional(), include: SlotIncludeObjectSchema.optional(), where: SlotWhereUniqueInputObjectSchema, create: z.union([ SlotCreateInputObjectSchema, SlotUncheckedCreateInputObjectSchema ]), update: z.union([ SlotUpdateInputObjectSchema, SlotUncheckedUpdateInputObjectSchema ]) }).strict();