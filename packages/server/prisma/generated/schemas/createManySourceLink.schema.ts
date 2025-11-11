import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SourceLinkCreateManyInputObjectSchema as SourceLinkCreateManyInputObjectSchema } from './objects/SourceLinkCreateManyInput.schema';

export const SourceLinkCreateManySchema: z.ZodType<Prisma.SourceLinkCreateManyArgs> = z.object({ data: z.union([ SourceLinkCreateManyInputObjectSchema, z.array(SourceLinkCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.SourceLinkCreateManyArgs>;

export const SourceLinkCreateManyZodSchema = z.object({ data: z.union([ SourceLinkCreateManyInputObjectSchema, z.array(SourceLinkCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();