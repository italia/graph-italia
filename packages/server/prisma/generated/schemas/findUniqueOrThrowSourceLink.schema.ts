import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SourceLinkSelectObjectSchema as SourceLinkSelectObjectSchema } from './objects/SourceLinkSelect.schema';
import { SourceLinkIncludeObjectSchema as SourceLinkIncludeObjectSchema } from './objects/SourceLinkInclude.schema';
import { SourceLinkWhereUniqueInputObjectSchema as SourceLinkWhereUniqueInputObjectSchema } from './objects/SourceLinkWhereUniqueInput.schema';

export const SourceLinkFindUniqueOrThrowSchema: z.ZodType<Prisma.SourceLinkFindUniqueOrThrowArgs> = z.object({ select: SourceLinkSelectObjectSchema.optional(), include: SourceLinkIncludeObjectSchema.optional(), where: SourceLinkWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.SourceLinkFindUniqueOrThrowArgs>;

export const SourceLinkFindUniqueOrThrowZodSchema = z.object({ select: SourceLinkSelectObjectSchema.optional(), include: SourceLinkIncludeObjectSchema.optional(), where: SourceLinkWhereUniqueInputObjectSchema }).strict();