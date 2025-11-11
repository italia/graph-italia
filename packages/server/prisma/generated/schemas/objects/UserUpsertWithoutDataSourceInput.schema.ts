import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserUpdateWithoutDataSourceInputObjectSchema as UserUpdateWithoutDataSourceInputObjectSchema } from './UserUpdateWithoutDataSourceInput.schema';
import { UserUncheckedUpdateWithoutDataSourceInputObjectSchema as UserUncheckedUpdateWithoutDataSourceInputObjectSchema } from './UserUncheckedUpdateWithoutDataSourceInput.schema';
import { UserCreateWithoutDataSourceInputObjectSchema as UserCreateWithoutDataSourceInputObjectSchema } from './UserCreateWithoutDataSourceInput.schema';
import { UserUncheckedCreateWithoutDataSourceInputObjectSchema as UserUncheckedCreateWithoutDataSourceInputObjectSchema } from './UserUncheckedCreateWithoutDataSourceInput.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => UserUpdateWithoutDataSourceInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutDataSourceInputObjectSchema)]),
  create: z.union([z.lazy(() => UserCreateWithoutDataSourceInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutDataSourceInputObjectSchema)]),
  where: z.lazy(() => UserWhereInputObjectSchema).optional()
}).strict();
export const UserUpsertWithoutDataSourceInputObjectSchema: z.ZodType<Prisma.UserUpsertWithoutDataSourceInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpsertWithoutDataSourceInput>;
export const UserUpsertWithoutDataSourceInputObjectZodSchema = makeSchema();
