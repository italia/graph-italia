import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserArgsObjectSchema as UserArgsObjectSchema } from './UserArgs.schema';
import { SlotFindManySchema as SlotFindManySchema } from '../findManySlot.schema';
import { DashboardCountOutputTypeArgsObjectSchema as DashboardCountOutputTypeArgsObjectSchema } from './DashboardCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  publish: z.boolean().optional(),
  user: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  userId: z.boolean().optional(),
  slots: z.union([z.boolean(), z.lazy(() => SlotFindManySchema)]).optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  _count: z.union([z.boolean(), z.lazy(() => DashboardCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const DashboardSelectObjectSchema: z.ZodType<Prisma.DashboardSelect> = makeSchema() as unknown as z.ZodType<Prisma.DashboardSelect>;
export const DashboardSelectObjectZodSchema = makeSchema();
