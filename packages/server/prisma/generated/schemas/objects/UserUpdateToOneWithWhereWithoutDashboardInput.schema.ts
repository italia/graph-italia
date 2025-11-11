import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserUpdateWithoutDashboardInputObjectSchema as UserUpdateWithoutDashboardInputObjectSchema } from './UserUpdateWithoutDashboardInput.schema';
import { UserUncheckedUpdateWithoutDashboardInputObjectSchema as UserUncheckedUpdateWithoutDashboardInputObjectSchema } from './UserUncheckedUpdateWithoutDashboardInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => UserUpdateWithoutDashboardInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutDashboardInputObjectSchema)])
}).strict();
export const UserUpdateToOneWithWhereWithoutDashboardInputObjectSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutDashboardInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutDashboardInput>;
export const UserUpdateToOneWithWhereWithoutDashboardInputObjectZodSchema = makeSchema();
