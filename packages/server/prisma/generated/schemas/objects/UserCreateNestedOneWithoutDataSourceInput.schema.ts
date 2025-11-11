import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutDataSourceInputObjectSchema as UserCreateWithoutDataSourceInputObjectSchema } from './UserCreateWithoutDataSourceInput.schema';
import { UserUncheckedCreateWithoutDataSourceInputObjectSchema as UserUncheckedCreateWithoutDataSourceInputObjectSchema } from './UserUncheckedCreateWithoutDataSourceInput.schema';
import { UserCreateOrConnectWithoutDataSourceInputObjectSchema as UserCreateOrConnectWithoutDataSourceInputObjectSchema } from './UserCreateOrConnectWithoutDataSourceInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutDataSourceInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutDataSourceInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutDataSourceInputObjectSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional()
}).strict();
export const UserCreateNestedOneWithoutDataSourceInputObjectSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutDataSourceInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateNestedOneWithoutDataSourceInput>;
export const UserCreateNestedOneWithoutDataSourceInputObjectZodSchema = makeSchema();
