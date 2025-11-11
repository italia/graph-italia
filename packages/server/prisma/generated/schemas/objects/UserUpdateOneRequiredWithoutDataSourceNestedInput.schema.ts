import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutDataSourceInputObjectSchema as UserCreateWithoutDataSourceInputObjectSchema } from './UserCreateWithoutDataSourceInput.schema';
import { UserUncheckedCreateWithoutDataSourceInputObjectSchema as UserUncheckedCreateWithoutDataSourceInputObjectSchema } from './UserUncheckedCreateWithoutDataSourceInput.schema';
import { UserCreateOrConnectWithoutDataSourceInputObjectSchema as UserCreateOrConnectWithoutDataSourceInputObjectSchema } from './UserCreateOrConnectWithoutDataSourceInput.schema';
import { UserUpsertWithoutDataSourceInputObjectSchema as UserUpsertWithoutDataSourceInputObjectSchema } from './UserUpsertWithoutDataSourceInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutDataSourceInputObjectSchema as UserUpdateToOneWithWhereWithoutDataSourceInputObjectSchema } from './UserUpdateToOneWithWhereWithoutDataSourceInput.schema';
import { UserUpdateWithoutDataSourceInputObjectSchema as UserUpdateWithoutDataSourceInputObjectSchema } from './UserUpdateWithoutDataSourceInput.schema';
import { UserUncheckedUpdateWithoutDataSourceInputObjectSchema as UserUncheckedUpdateWithoutDataSourceInputObjectSchema } from './UserUncheckedUpdateWithoutDataSourceInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutDataSourceInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutDataSourceInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutDataSourceInputObjectSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutDataSourceInputObjectSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => UserUpdateToOneWithWhereWithoutDataSourceInputObjectSchema), z.lazy(() => UserUpdateWithoutDataSourceInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutDataSourceInputObjectSchema)]).optional()
}).strict();
export const UserUpdateOneRequiredWithoutDataSourceNestedInputObjectSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutDataSourceNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateOneRequiredWithoutDataSourceNestedInput>;
export const UserUpdateOneRequiredWithoutDataSourceNestedInputObjectZodSchema = makeSchema();
