import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutChartInputObjectSchema as UserCreateWithoutChartInputObjectSchema } from './UserCreateWithoutChartInput.schema';
import { UserUncheckedCreateWithoutChartInputObjectSchema as UserUncheckedCreateWithoutChartInputObjectSchema } from './UserUncheckedCreateWithoutChartInput.schema';
import { UserCreateOrConnectWithoutChartInputObjectSchema as UserCreateOrConnectWithoutChartInputObjectSchema } from './UserCreateOrConnectWithoutChartInput.schema';
import { UserUpsertWithoutChartInputObjectSchema as UserUpsertWithoutChartInputObjectSchema } from './UserUpsertWithoutChartInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutChartInputObjectSchema as UserUpdateToOneWithWhereWithoutChartInputObjectSchema } from './UserUpdateToOneWithWhereWithoutChartInput.schema';
import { UserUpdateWithoutChartInputObjectSchema as UserUpdateWithoutChartInputObjectSchema } from './UserUpdateWithoutChartInput.schema';
import { UserUncheckedUpdateWithoutChartInputObjectSchema as UserUncheckedUpdateWithoutChartInputObjectSchema } from './UserUncheckedUpdateWithoutChartInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutChartInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutChartInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutChartInputObjectSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutChartInputObjectSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => UserUpdateToOneWithWhereWithoutChartInputObjectSchema), z.lazy(() => UserUpdateWithoutChartInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutChartInputObjectSchema)]).optional()
}).strict();
export const UserUpdateOneRequiredWithoutChartNestedInputObjectSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutChartNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateOneRequiredWithoutChartNestedInput>;
export const UserUpdateOneRequiredWithoutChartNestedInputObjectZodSchema = makeSchema();
