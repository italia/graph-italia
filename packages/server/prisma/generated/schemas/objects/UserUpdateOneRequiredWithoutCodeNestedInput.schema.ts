import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutCodeInputObjectSchema as UserCreateWithoutCodeInputObjectSchema } from './UserCreateWithoutCodeInput.schema';
import { UserUncheckedCreateWithoutCodeInputObjectSchema as UserUncheckedCreateWithoutCodeInputObjectSchema } from './UserUncheckedCreateWithoutCodeInput.schema';
import { UserCreateOrConnectWithoutCodeInputObjectSchema as UserCreateOrConnectWithoutCodeInputObjectSchema } from './UserCreateOrConnectWithoutCodeInput.schema';
import { UserUpsertWithoutCodeInputObjectSchema as UserUpsertWithoutCodeInputObjectSchema } from './UserUpsertWithoutCodeInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutCodeInputObjectSchema as UserUpdateToOneWithWhereWithoutCodeInputObjectSchema } from './UserUpdateToOneWithWhereWithoutCodeInput.schema';
import { UserUpdateWithoutCodeInputObjectSchema as UserUpdateWithoutCodeInputObjectSchema } from './UserUpdateWithoutCodeInput.schema';
import { UserUncheckedUpdateWithoutCodeInputObjectSchema as UserUncheckedUpdateWithoutCodeInputObjectSchema } from './UserUncheckedUpdateWithoutCodeInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutCodeInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutCodeInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutCodeInputObjectSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutCodeInputObjectSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => UserUpdateToOneWithWhereWithoutCodeInputObjectSchema), z.lazy(() => UserUpdateWithoutCodeInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutCodeInputObjectSchema)]).optional()
}).strict();
export const UserUpdateOneRequiredWithoutCodeNestedInputObjectSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutCodeNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateOneRequiredWithoutCodeNestedInput>;
export const UserUpdateOneRequiredWithoutCodeNestedInputObjectZodSchema = makeSchema();
