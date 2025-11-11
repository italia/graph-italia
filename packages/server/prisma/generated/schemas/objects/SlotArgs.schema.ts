import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SlotSelectObjectSchema as SlotSelectObjectSchema } from './SlotSelect.schema';
import { SlotIncludeObjectSchema as SlotIncludeObjectSchema } from './SlotInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => SlotSelectObjectSchema).optional(),
  include: z.lazy(() => SlotIncludeObjectSchema).optional()
}).strict();
export const SlotArgsObjectSchema = makeSchema();
export const SlotArgsObjectZodSchema = makeSchema();
