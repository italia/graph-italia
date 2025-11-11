import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SourceLinkSelectObjectSchema as SourceLinkSelectObjectSchema } from './objects/SourceLinkSelect.schema';
import { SourceLinkUpdateManyMutationInputObjectSchema as SourceLinkUpdateManyMutationInputObjectSchema } from './objects/SourceLinkUpdateManyMutationInput.schema';
import { SourceLinkWhereInputObjectSchema as SourceLinkWhereInputObjectSchema } from './objects/SourceLinkWhereInput.schema';

export const SourceLinkUpdateManyAndReturnSchema: z.ZodType<Prisma.SourceLinkUpdateManyAndReturnArgs> = z.object({ select: SourceLinkSelectObjectSchema.optional(), data: SourceLinkUpdateManyMutationInputObjectSchema, where: SourceLinkWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.SourceLinkUpdateManyAndReturnArgs>;

export const SourceLinkUpdateManyAndReturnZodSchema = z.object({ select: SourceLinkSelectObjectSchema.optional(), data: SourceLinkUpdateManyMutationInputObjectSchema, where: SourceLinkWhereInputObjectSchema.optional() }).strict();