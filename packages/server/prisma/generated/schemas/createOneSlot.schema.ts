import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SlotSelectObjectSchema as SlotSelectObjectSchema } from './objects/SlotSelect.schema';
import { SlotIncludeObjectSchema as SlotIncludeObjectSchema } from './objects/SlotInclude.schema';
import { SlotCreateInputObjectSchema as SlotCreateInputObjectSchema } from './objects/SlotCreateInput.schema';
import { SlotUncheckedCreateInputObjectSchema as SlotUncheckedCreateInputObjectSchema } from './objects/SlotUncheckedCreateInput.schema';

export const SlotCreateOneSchema: z.ZodType<Prisma.SlotCreateArgs> = z.object({ select: SlotSelectObjectSchema.optional(), include: SlotIncludeObjectSchema.optional(), data: z.union([SlotCreateInputObjectSchema, SlotUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.SlotCreateArgs>;

export const SlotCreateOneZodSchema = z.object({ select: SlotSelectObjectSchema.optional(), include: SlotIncludeObjectSchema.optional(), data: z.union([SlotCreateInputObjectSchema, SlotUncheckedCreateInputObjectSchema]) }).strict();