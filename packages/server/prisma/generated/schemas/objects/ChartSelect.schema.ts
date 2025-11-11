import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserArgsObjectSchema as UserArgsObjectSchema } from './UserArgs.schema';
import { SlotFindManySchema as SlotFindManySchema } from '../findManySlot.schema';
import { SourceLinkFindManySchema as SourceLinkFindManySchema } from '../findManySourceLink.schema';
import { ChartCountOutputTypeArgsObjectSchema as ChartCountOutputTypeArgsObjectSchema } from './ChartCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  chart: z.boolean().optional(),
  config: z.boolean().optional(),
  data: z.boolean().optional(),
  publish: z.boolean().optional(),
  remoteUrl: z.boolean().optional(),
  isRemote: z.boolean().optional(),
  preview: z.boolean().optional(),
  user: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  userId: z.boolean().optional(),
  slot: z.union([z.boolean(), z.lazy(() => SlotFindManySchema)]).optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  SourceLink: z.union([z.boolean(), z.lazy(() => SourceLinkFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => ChartCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const ChartSelectObjectSchema: z.ZodType<Prisma.ChartSelect> = makeSchema() as unknown as z.ZodType<Prisma.ChartSelect>;
export const ChartSelectObjectZodSchema = makeSchema();
