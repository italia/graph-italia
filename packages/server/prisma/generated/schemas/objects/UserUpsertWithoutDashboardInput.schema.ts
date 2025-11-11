import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserUpdateWithoutDashboardInputObjectSchema as UserUpdateWithoutDashboardInputObjectSchema } from './UserUpdateWithoutDashboardInput.schema';
import { UserUncheckedUpdateWithoutDashboardInputObjectSchema as UserUncheckedUpdateWithoutDashboardInputObjectSchema } from './UserUncheckedUpdateWithoutDashboardInput.schema';
import { UserCreateWithoutDashboardInputObjectSchema as UserCreateWithoutDashboardInputObjectSchema } from './UserCreateWithoutDashboardInput.schema';
import { UserUncheckedCreateWithoutDashboardInputObjectSchema as UserUncheckedCreateWithoutDashboardInputObjectSchema } from './UserUncheckedCreateWithoutDashboardInput.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => UserUpdateWithoutDashboardInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutDashboardInputObjectSchema)]),
  create: z.union([z.lazy(() => UserCreateWithoutDashboardInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutDashboardInputObjectSchema)]),
  where: z.lazy(() => UserWhereInputObjectSchema).optional()
}).strict();
export const UserUpsertWithoutDashboardInputObjectSchema: z.ZodType<Prisma.UserUpsertWithoutDashboardInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpsertWithoutDashboardInput>;
export const UserUpsertWithoutDashboardInputObjectZodSchema = makeSchema();
