import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SlotCreateNestedManyWithoutDashboardInputObjectSchema as SlotCreateNestedManyWithoutDashboardInputObjectSchema } from './SlotCreateNestedManyWithoutDashboardInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  publish: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  slots: z.lazy(() => SlotCreateNestedManyWithoutDashboardInputObjectSchema).optional()
}).strict();
export const DashboardCreateWithoutUserInputObjectSchema: z.ZodType<Prisma.DashboardCreateWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.DashboardCreateWithoutUserInput>;
export const DashboardCreateWithoutUserInputObjectZodSchema = makeSchema();
