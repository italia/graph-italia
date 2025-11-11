import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutDataSourceInputObjectSchema as UserCreateWithoutDataSourceInputObjectSchema } from './UserCreateWithoutDataSourceInput.schema';
import { UserUncheckedCreateWithoutDataSourceInputObjectSchema as UserUncheckedCreateWithoutDataSourceInputObjectSchema } from './UserUncheckedCreateWithoutDataSourceInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UserCreateWithoutDataSourceInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutDataSourceInputObjectSchema)])
}).strict();
export const UserCreateOrConnectWithoutDataSourceInputObjectSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutDataSourceInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateOrConnectWithoutDataSourceInput>;
export const UserCreateOrConnectWithoutDataSourceInputObjectZodSchema = makeSchema();
