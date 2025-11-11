import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutDashboardInputObjectSchema as UserCreateWithoutDashboardInputObjectSchema } from './UserCreateWithoutDashboardInput.schema';
import { UserUncheckedCreateWithoutDashboardInputObjectSchema as UserUncheckedCreateWithoutDashboardInputObjectSchema } from './UserUncheckedCreateWithoutDashboardInput.schema';
import { UserCreateOrConnectWithoutDashboardInputObjectSchema as UserCreateOrConnectWithoutDashboardInputObjectSchema } from './UserCreateOrConnectWithoutDashboardInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutDashboardInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutDashboardInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutDashboardInputObjectSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional()
}).strict();
export const UserCreateNestedOneWithoutDashboardInputObjectSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutDashboardInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateNestedOneWithoutDashboardInput>;
export const UserCreateNestedOneWithoutDashboardInputObjectZodSchema = makeSchema();
