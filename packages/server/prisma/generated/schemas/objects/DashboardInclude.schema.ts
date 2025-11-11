import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserArgsObjectSchema as UserArgsObjectSchema } from './UserArgs.schema';
import { SlotFindManySchema as SlotFindManySchema } from '../findManySlot.schema';
import { DashboardCountOutputTypeArgsObjectSchema as DashboardCountOutputTypeArgsObjectSchema } from './DashboardCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  user: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  slots: z.union([z.boolean(), z.lazy(() => SlotFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => DashboardCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const DashboardIncludeObjectSchema: z.ZodType<Prisma.DashboardInclude> = makeSchema() as unknown as z.ZodType<Prisma.DashboardInclude>;
export const DashboardIncludeObjectZodSchema = makeSchema();
