import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SourceLinkSelectObjectSchema as SourceLinkSelectObjectSchema } from './objects/SourceLinkSelect.schema';
import { SourceLinkIncludeObjectSchema as SourceLinkIncludeObjectSchema } from './objects/SourceLinkInclude.schema';
import { SourceLinkWhereUniqueInputObjectSchema as SourceLinkWhereUniqueInputObjectSchema } from './objects/SourceLinkWhereUniqueInput.schema';

export const SourceLinkDeleteOneSchema: z.ZodType<Prisma.SourceLinkDeleteArgs> = z.object({ select: SourceLinkSelectObjectSchema.optional(), include: SourceLinkIncludeObjectSchema.optional(), where: SourceLinkWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.SourceLinkDeleteArgs>;

export const SourceLinkDeleteOneZodSchema = z.object({ select: SourceLinkSelectObjectSchema.optional(), include: SourceLinkIncludeObjectSchema.optional(), where: SourceLinkWhereUniqueInputObjectSchema }).strict();