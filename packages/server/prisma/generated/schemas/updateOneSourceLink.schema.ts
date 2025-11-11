import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SourceLinkSelectObjectSchema as SourceLinkSelectObjectSchema } from './objects/SourceLinkSelect.schema';
import { SourceLinkIncludeObjectSchema as SourceLinkIncludeObjectSchema } from './objects/SourceLinkInclude.schema';
import { SourceLinkUpdateInputObjectSchema as SourceLinkUpdateInputObjectSchema } from './objects/SourceLinkUpdateInput.schema';
import { SourceLinkUncheckedUpdateInputObjectSchema as SourceLinkUncheckedUpdateInputObjectSchema } from './objects/SourceLinkUncheckedUpdateInput.schema';
import { SourceLinkWhereUniqueInputObjectSchema as SourceLinkWhereUniqueInputObjectSchema } from './objects/SourceLinkWhereUniqueInput.schema';

export const SourceLinkUpdateOneSchema: z.ZodType<Prisma.SourceLinkUpdateArgs> = z.object({ select: SourceLinkSelectObjectSchema.optional(), include: SourceLinkIncludeObjectSchema.optional(), data: z.union([SourceLinkUpdateInputObjectSchema, SourceLinkUncheckedUpdateInputObjectSchema]), where: SourceLinkWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.SourceLinkUpdateArgs>;

export const SourceLinkUpdateOneZodSchema = z.object({ select: SourceLinkSelectObjectSchema.optional(), include: SourceLinkIncludeObjectSchema.optional(), data: z.union([SourceLinkUpdateInputObjectSchema, SourceLinkUncheckedUpdateInputObjectSchema]), where: SourceLinkWhereUniqueInputObjectSchema }).strict();