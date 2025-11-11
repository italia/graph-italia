import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutDashboardInputObjectSchema as UserCreateWithoutDashboardInputObjectSchema } from './UserCreateWithoutDashboardInput.schema';
import { UserUncheckedCreateWithoutDashboardInputObjectSchema as UserUncheckedCreateWithoutDashboardInputObjectSchema } from './UserUncheckedCreateWithoutDashboardInput.schema';
import { UserCreateOrConnectWithoutDashboardInputObjectSchema as UserCreateOrConnectWithoutDashboardInputObjectSchema } from './UserCreateOrConnectWithoutDashboardInput.schema';
import { UserUpsertWithoutDashboardInputObjectSchema as UserUpsertWithoutDashboardInputObjectSchema } from './UserUpsertWithoutDashboardInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutDashboardInputObjectSchema as UserUpdateToOneWithWhereWithoutDashboardInputObjectSchema } from './UserUpdateToOneWithWhereWithoutDashboardInput.schema';
import { UserUpdateWithoutDashboardInputObjectSchema as UserUpdateWithoutDashboardInputObjectSchema } from './UserUpdateWithoutDashboardInput.schema';
import { UserUncheckedUpdateWithoutDashboardInputObjectSchema as UserUncheckedUpdateWithoutDashboardInputObjectSchema } from './UserUncheckedUpdateWithoutDashboardInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutDashboardInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutDashboardInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutDashboardInputObjectSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutDashboardInputObjectSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => UserUpdateToOneWithWhereWithoutDashboardInputObjectSchema), z.lazy(() => UserUpdateWithoutDashboardInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutDashboardInputObjectSchema)]).optional()
}).strict();
export const UserUpdateOneRequiredWithoutDashboardNestedInputObjectSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutDashboardNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateOneRequiredWithoutDashboardNestedInput>;
export const UserUpdateOneRequiredWithoutDashboardNestedInputObjectZodSchema = makeSchema();
