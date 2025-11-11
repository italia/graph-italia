import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SourceLinkSelectObjectSchema as SourceLinkSelectObjectSchema } from './objects/SourceLinkSelect.schema';
import { SourceLinkIncludeObjectSchema as SourceLinkIncludeObjectSchema } from './objects/SourceLinkInclude.schema';
import { SourceLinkCreateInputObjectSchema as SourceLinkCreateInputObjectSchema } from './objects/SourceLinkCreateInput.schema';
import { SourceLinkUncheckedCreateInputObjectSchema as SourceLinkUncheckedCreateInputObjectSchema } from './objects/SourceLinkUncheckedCreateInput.schema';

export const SourceLinkCreateOneSchema: z.ZodType<Prisma.SourceLinkCreateArgs> = z.object({ select: SourceLinkSelectObjectSchema.optional(), include: SourceLinkIncludeObjectSchema.optional(), data: z.union([SourceLinkCreateInputObjectSchema, SourceLinkUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.SourceLinkCreateArgs>;

export const SourceLinkCreateOneZodSchema = z.object({ select: SourceLinkSelectObjectSchema.optional(), include: SourceLinkIncludeObjectSchema.optional(), data: z.union([SourceLinkCreateInputObjectSchema, SourceLinkUncheckedCreateInputObjectSchema]) }).strict();