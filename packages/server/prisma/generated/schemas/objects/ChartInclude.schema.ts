import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserArgsObjectSchema as UserArgsObjectSchema } from './UserArgs.schema';
import { SlotFindManySchema as SlotFindManySchema } from '../findManySlot.schema';
import { SourceLinkFindManySchema as SourceLinkFindManySchema } from '../findManySourceLink.schema';
import { ChartCountOutputTypeArgsObjectSchema as ChartCountOutputTypeArgsObjectSchema } from './ChartCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  user: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  slot: z.union([z.boolean(), z.lazy(() => SlotFindManySchema)]).optional(),
  SourceLink: z.union([z.boolean(), z.lazy(() => SourceLinkFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => ChartCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const ChartIncludeObjectSchema: z.ZodType<Prisma.ChartInclude> = makeSchema() as unknown as z.ZodType<Prisma.ChartInclude>;
export const ChartIncludeObjectZodSchema = makeSchema();
