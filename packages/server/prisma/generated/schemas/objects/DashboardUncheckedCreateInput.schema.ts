import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SlotUncheckedCreateNestedManyWithoutDashboardInputObjectSchema as SlotUncheckedCreateNestedManyWithoutDashboardInputObjectSchema } from './SlotUncheckedCreateNestedManyWithoutDashboardInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  publish: z.boolean().optional(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  slots: z.lazy(() => SlotUncheckedCreateNestedManyWithoutDashboardInputObjectSchema)
}).strict();
export const DashboardUncheckedCreateInputObjectSchema: z.ZodType<Prisma.DashboardUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.DashboardUncheckedCreateInput>;
export const DashboardUncheckedCreateInputObjectZodSchema = makeSchema();
