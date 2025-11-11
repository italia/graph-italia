import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SourceLinkWhereInputObjectSchema as SourceLinkWhereInputObjectSchema } from './objects/SourceLinkWhereInput.schema';

export const SourceLinkDeleteManySchema: z.ZodType<Prisma.SourceLinkDeleteManyArgs> = z.object({ where: SourceLinkWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.SourceLinkDeleteManyArgs>;

export const SourceLinkDeleteManyZodSchema = z.object({ where: SourceLinkWhereInputObjectSchema.optional() }).strict();