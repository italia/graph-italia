import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutDashboardInputObjectSchema as UserCreateWithoutDashboardInputObjectSchema } from './UserCreateWithoutDashboardInput.schema';
import { UserUncheckedCreateWithoutDashboardInputObjectSchema as UserUncheckedCreateWithoutDashboardInputObjectSchema } from './UserUncheckedCreateWithoutDashboardInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UserCreateWithoutDashboardInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutDashboardInputObjectSchema)])
}).strict();
export const UserCreateOrConnectWithoutDashboardInputObjectSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutDashboardInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateOrConnectWithoutDashboardInput>;
export const UserCreateOrConnectWithoutDashboardInputObjectZodSchema = makeSchema();
