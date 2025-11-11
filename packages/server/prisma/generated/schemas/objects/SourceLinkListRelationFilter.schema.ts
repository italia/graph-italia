import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SourceLinkWhereInputObjectSchema as SourceLinkWhereInputObjectSchema } from './SourceLinkWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => SourceLinkWhereInputObjectSchema).optional(),
  some: z.lazy(() => SourceLinkWhereInputObjectSchema).optional(),
  none: z.lazy(() => SourceLinkWhereInputObjectSchema).optional()
}).strict();
export const SourceLinkListRelationFilterObjectSchema: z.ZodType<Prisma.SourceLinkListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.SourceLinkListRelationFilter>;
export const SourceLinkListRelationFilterObjectZodSchema = makeSchema();
