import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SlotUncheckedCreateNestedManyWithoutDashboardInputObjectSchema as SlotUncheckedCreateNestedManyWithoutDashboardInputObjectSchema } from './SlotUncheckedCreateNestedManyWithoutDashboardInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  publish: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  slots: z.lazy(() => SlotUncheckedCreateNestedManyWithoutDashboardInputObjectSchema).optional()
}).strict();
export const DashboardUncheckedCreateWithoutUserInputObjectSchema: z.ZodType<Prisma.DashboardUncheckedCreateWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.DashboardUncheckedCreateWithoutUserInput>;
export const DashboardUncheckedCreateWithoutUserInputObjectZodSchema = makeSchema();
