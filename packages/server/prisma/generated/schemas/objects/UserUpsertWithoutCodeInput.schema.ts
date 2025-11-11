import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserUpdateWithoutCodeInputObjectSchema as UserUpdateWithoutCodeInputObjectSchema } from './UserUpdateWithoutCodeInput.schema';
import { UserUncheckedUpdateWithoutCodeInputObjectSchema as UserUncheckedUpdateWithoutCodeInputObjectSchema } from './UserUncheckedUpdateWithoutCodeInput.schema';
import { UserCreateWithoutCodeInputObjectSchema as UserCreateWithoutCodeInputObjectSchema } from './UserCreateWithoutCodeInput.schema';
import { UserUncheckedCreateWithoutCodeInputObjectSchema as UserUncheckedCreateWithoutCodeInputObjectSchema } from './UserUncheckedCreateWithoutCodeInput.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => UserUpdateWithoutCodeInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutCodeInputObjectSchema)]),
  create: z.union([z.lazy(() => UserCreateWithoutCodeInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutCodeInputObjectSchema)]),
  where: z.lazy(() => UserWhereInputObjectSchema).optional()
}).strict();
export const UserUpsertWithoutCodeInputObjectSchema: z.ZodType<Prisma.UserUpsertWithoutCodeInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpsertWithoutCodeInput>;
export const UserUpsertWithoutCodeInputObjectZodSchema = makeSchema();
