import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateNestedOneWithoutDashboardInputObjectSchema as UserCreateNestedOneWithoutDashboardInputObjectSchema } from './UserCreateNestedOneWithoutDashboardInput.schema';
import { SlotCreateNestedManyWithoutDashboardInputObjectSchema as SlotCreateNestedManyWithoutDashboardInputObjectSchema } from './SlotCreateNestedManyWithoutDashboardInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  publish: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutDashboardInputObjectSchema),
  slots: z.lazy(() => SlotCreateNestedManyWithoutDashboardInputObjectSchema)
}).strict();
export const DashboardCreateInputObjectSchema: z.ZodType<Prisma.DashboardCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.DashboardCreateInput>;
export const DashboardCreateInputObjectZodSchema = makeSchema();
