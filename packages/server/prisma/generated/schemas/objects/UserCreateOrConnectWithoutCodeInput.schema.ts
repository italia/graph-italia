import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutCodeInputObjectSchema as UserCreateWithoutCodeInputObjectSchema } from './UserCreateWithoutCodeInput.schema';
import { UserUncheckedCreateWithoutCodeInputObjectSchema as UserUncheckedCreateWithoutCodeInputObjectSchema } from './UserUncheckedCreateWithoutCodeInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UserCreateWithoutCodeInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutCodeInputObjectSchema)])
}).strict();
export const UserCreateOrConnectWithoutCodeInputObjectSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutCodeInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateOrConnectWithoutCodeInput>;
export const UserCreateOrConnectWithoutCodeInputObjectZodSchema = makeSchema();
