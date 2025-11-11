import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SourceLinkUpdateManyMutationInputObjectSchema as SourceLinkUpdateManyMutationInputObjectSchema } from './objects/SourceLinkUpdateManyMutationInput.schema';
import { SourceLinkWhereInputObjectSchema as SourceLinkWhereInputObjectSchema } from './objects/SourceLinkWhereInput.schema';

export const SourceLinkUpdateManySchema: z.ZodType<Prisma.SourceLinkUpdateManyArgs> = z.object({ data: SourceLinkUpdateManyMutationInputObjectSchema, where: SourceLinkWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.SourceLinkUpdateManyArgs>;

export const SourceLinkUpdateManyZodSchema = z.object({ data: SourceLinkUpdateManyMutationInputObjectSchema, where: SourceLinkWhereInputObjectSchema.optional() }).strict();