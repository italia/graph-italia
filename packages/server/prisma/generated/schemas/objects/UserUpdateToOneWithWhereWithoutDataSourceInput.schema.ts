import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserUpdateWithoutDataSourceInputObjectSchema as UserUpdateWithoutDataSourceInputObjectSchema } from './UserUpdateWithoutDataSourceInput.schema';
import { UserUncheckedUpdateWithoutDataSourceInputObjectSchema as UserUncheckedUpdateWithoutDataSourceInputObjectSchema } from './UserUncheckedUpdateWithoutDataSourceInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => UserUpdateWithoutDataSourceInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutDataSourceInputObjectSchema)])
}).strict();
export const UserUpdateToOneWithWhereWithoutDataSourceInputObjectSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutDataSourceInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutDataSourceInput>;
export const UserUpdateToOneWithWhereWithoutDataSourceInputObjectZodSchema = makeSchema();
