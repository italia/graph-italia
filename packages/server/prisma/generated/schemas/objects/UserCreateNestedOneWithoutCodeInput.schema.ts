import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutCodeInputObjectSchema as UserCreateWithoutCodeInputObjectSchema } from './UserCreateWithoutCodeInput.schema';
import { UserUncheckedCreateWithoutCodeInputObjectSchema as UserUncheckedCreateWithoutCodeInputObjectSchema } from './UserUncheckedCreateWithoutCodeInput.schema';
import { UserCreateOrConnectWithoutCodeInputObjectSchema as UserCreateOrConnectWithoutCodeInputObjectSchema } from './UserCreateOrConnectWithoutCodeInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutCodeInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutCodeInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutCodeInputObjectSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional()
}).strict();
export const UserCreateNestedOneWithoutCodeInputObjectSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutCodeInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateNestedOneWithoutCodeInput>;
export const UserCreateNestedOneWithoutCodeInputObjectZodSchema = makeSchema();
