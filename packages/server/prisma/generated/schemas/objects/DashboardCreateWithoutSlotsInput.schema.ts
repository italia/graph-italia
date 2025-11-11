import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateNestedOneWithoutDashboardInputObjectSchema as UserCreateNestedOneWithoutDashboardInputObjectSchema } from './UserCreateNestedOneWithoutDashboardInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  publish: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutDashboardInputObjectSchema)
}).strict();
export const DashboardCreateWithoutSlotsInputObjectSchema: z.ZodType<Prisma.DashboardCreateWithoutSlotsInput> = makeSchema() as unknown as z.ZodType<Prisma.DashboardCreateWithoutSlotsInput>;
export const DashboardCreateWithoutSlotsInputObjectZodSchema = makeSchema();
