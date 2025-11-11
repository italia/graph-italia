import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserUpdateWithoutChartInputObjectSchema as UserUpdateWithoutChartInputObjectSchema } from './UserUpdateWithoutChartInput.schema';
import { UserUncheckedUpdateWithoutChartInputObjectSchema as UserUncheckedUpdateWithoutChartInputObjectSchema } from './UserUncheckedUpdateWithoutChartInput.schema';
import { UserCreateWithoutChartInputObjectSchema as UserCreateWithoutChartInputObjectSchema } from './UserCreateWithoutChartInput.schema';
import { UserUncheckedCreateWithoutChartInputObjectSchema as UserUncheckedCreateWithoutChartInputObjectSchema } from './UserUncheckedCreateWithoutChartInput.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => UserUpdateWithoutChartInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutChartInputObjectSchema)]),
  create: z.union([z.lazy(() => UserCreateWithoutChartInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutChartInputObjectSchema)]),
  where: z.lazy(() => UserWhereInputObjectSchema).optional()
}).strict();
export const UserUpsertWithoutChartInputObjectSchema: z.ZodType<Prisma.UserUpsertWithoutChartInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpsertWithoutChartInput>;
export const UserUpsertWithoutChartInputObjectZodSchema = makeSchema();
