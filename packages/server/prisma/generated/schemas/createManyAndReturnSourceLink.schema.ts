import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SourceLinkSelectObjectSchema as SourceLinkSelectObjectSchema } from './objects/SourceLinkSelect.schema';
import { SourceLinkCreateManyInputObjectSchema as SourceLinkCreateManyInputObjectSchema } from './objects/SourceLinkCreateManyInput.schema';

export const SourceLinkCreateManyAndReturnSchema: z.ZodType<Prisma.SourceLinkCreateManyAndReturnArgs> = z.object({ select: SourceLinkSelectObjectSchema.optional(), data: z.union([ SourceLinkCreateManyInputObjectSchema, z.array(SourceLinkCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.SourceLinkCreateManyAndReturnArgs>;

export const SourceLinkCreateManyAndReturnZodSchema = z.object({ select: SourceLinkSelectObjectSchema.optional(), data: z.union([ SourceLinkCreateManyInputObjectSchema, z.array(SourceLinkCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();