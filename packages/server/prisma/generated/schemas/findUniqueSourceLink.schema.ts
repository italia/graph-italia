import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SourceLinkSelectObjectSchema as SourceLinkSelectObjectSchema } from './objects/SourceLinkSelect.schema';
import { SourceLinkIncludeObjectSchema as SourceLinkIncludeObjectSchema } from './objects/SourceLinkInclude.schema';
import { SourceLinkWhereUniqueInputObjectSchema as SourceLinkWhereUniqueInputObjectSchema } from './objects/SourceLinkWhereUniqueInput.schema';

export const SourceLinkFindUniqueSchema: z.ZodType<Prisma.SourceLinkFindUniqueArgs> = z.object({ select: SourceLinkSelectObjectSchema.optional(), include: SourceLinkIncludeObjectSchema.optional(), where: SourceLinkWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.SourceLinkFindUniqueArgs>;

export const SourceLinkFindUniqueZodSchema = z.object({ select: SourceLinkSelectObjectSchema.optional(), include: SourceLinkIncludeObjectSchema.optional(), where: SourceLinkWhereUniqueInputObjectSchema }).strict();