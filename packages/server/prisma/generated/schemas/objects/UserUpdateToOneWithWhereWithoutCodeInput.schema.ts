import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserUpdateWithoutCodeInputObjectSchema as UserUpdateWithoutCodeInputObjectSchema } from './UserUpdateWithoutCodeInput.schema';
import { UserUncheckedUpdateWithoutCodeInputObjectSchema as UserUncheckedUpdateWithoutCodeInputObjectSchema } from './UserUncheckedUpdateWithoutCodeInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => UserUpdateWithoutCodeInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutCodeInputObjectSchema)])
}).strict();
export const UserUpdateToOneWithWhereWithoutCodeInputObjectSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutCodeInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutCodeInput>;
export const UserUpdateToOneWithWhereWithoutCodeInputObjectZodSchema = makeSchema();
