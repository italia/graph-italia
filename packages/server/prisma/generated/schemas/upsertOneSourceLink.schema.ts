import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SourceLinkSelectObjectSchema as SourceLinkSelectObjectSchema } from './objects/SourceLinkSelect.schema';
import { SourceLinkIncludeObjectSchema as SourceLinkIncludeObjectSchema } from './objects/SourceLinkInclude.schema';
import { SourceLinkWhereUniqueInputObjectSchema as SourceLinkWhereUniqueInputObjectSchema } from './objects/SourceLinkWhereUniqueInput.schema';
import { SourceLinkCreateInputObjectSchema as SourceLinkCreateInputObjectSchema } from './objects/SourceLinkCreateInput.schema';
import { SourceLinkUncheckedCreateInputObjectSchema as SourceLinkUncheckedCreateInputObjectSchema } from './objects/SourceLinkUncheckedCreateInput.schema';
import { SourceLinkUpdateInputObjectSchema as SourceLinkUpdateInputObjectSchema } from './objects/SourceLinkUpdateInput.schema';
import { SourceLinkUncheckedUpdateInputObjectSchema as SourceLinkUncheckedUpdateInputObjectSchema } from './objects/SourceLinkUncheckedUpdateInput.schema';

export const SourceLinkUpsertOneSchema: z.ZodType<Prisma.SourceLinkUpsertArgs> = z.object({ select: SourceLinkSelectObjectSchema.optional(), include: SourceLinkIncludeObjectSchema.optional(), where: SourceLinkWhereUniqueInputObjectSchema, create: z.union([ SourceLinkCreateInputObjectSchema, SourceLinkUncheckedCreateInputObjectSchema ]), update: z.union([ SourceLinkUpdateInputObjectSchema, SourceLinkUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.SourceLinkUpsertArgs>;

export const SourceLinkUpsertOneZodSchema = z.object({ select: SourceLinkSelectObjectSchema.optional(), include: SourceLinkIncludeObjectSchema.optional(), where: SourceLinkWhereUniqueInputObjectSchema, create: z.union([ SourceLinkCreateInputObjectSchema, SourceLinkUncheckedCreateInputObjectSchema ]), update: z.union([ SourceLinkUpdateInputObjectSchema, SourceLinkUncheckedUpdateInputObjectSchema ]) }).strict();