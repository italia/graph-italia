import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SlotSelectObjectSchema as SlotSelectObjectSchema } from './objects/SlotSelect.schema';
import { SlotIncludeObjectSchema as SlotIncludeObjectSchema } from './objects/SlotInclude.schema';
import { SlotWhereUniqueInputObjectSchema as SlotWhereUniqueInputObjectSchema } from './objects/SlotWhereUniqueInput.schema';

export const SlotDeleteOneSchema: z.ZodType<Prisma.SlotDeleteArgs> = z.object({ select: SlotSelectObjectSchema.optional(), include: SlotIncludeObjectSchema.optional(), where: SlotWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.SlotDeleteArgs>;

export const SlotDeleteOneZodSchema = z.object({ select: SlotSelectObjectSchema.optional(), include: SlotIncludeObjectSchema.optional(), where: SlotWhereUniqueInputObjectSchema }).strict();