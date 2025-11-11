import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SlotSelectObjectSchema as SlotSelectObjectSchema } from './objects/SlotSelect.schema';
import { SlotUpdateManyMutationInputObjectSchema as SlotUpdateManyMutationInputObjectSchema } from './objects/SlotUpdateManyMutationInput.schema';
import { SlotWhereInputObjectSchema as SlotWhereInputObjectSchema } from './objects/SlotWhereInput.schema';

export const SlotUpdateManyAndReturnSchema: z.ZodType<Prisma.SlotUpdateManyAndReturnArgs> = z.object({ select: SlotSelectObjectSchema.optional(), data: SlotUpdateManyMutationInputObjectSchema, where: SlotWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.SlotUpdateManyAndReturnArgs>;

export const SlotUpdateManyAndReturnZodSchema = z.object({ select: SlotSelectObjectSchema.optional(), data: SlotUpdateManyMutationInputObjectSchema, where: SlotWhereInputObjectSchema.optional() }).strict();