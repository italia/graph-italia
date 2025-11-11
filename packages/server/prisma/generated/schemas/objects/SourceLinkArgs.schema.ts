import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SourceLinkSelectObjectSchema as SourceLinkSelectObjectSchema } from './SourceLinkSelect.schema';
import { SourceLinkIncludeObjectSchema as SourceLinkIncludeObjectSchema } from './SourceLinkInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => SourceLinkSelectObjectSchema).optional(),
  include: z.lazy(() => SourceLinkIncludeObjectSchema).optional()
}).strict();
export const SourceLinkArgsObjectSchema = makeSchema();
export const SourceLinkArgsObjectZodSchema = makeSchema();
