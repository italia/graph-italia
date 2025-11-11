import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutChartInputObjectSchema as UserCreateWithoutChartInputObjectSchema } from './UserCreateWithoutChartInput.schema';
import { UserUncheckedCreateWithoutChartInputObjectSchema as UserUncheckedCreateWithoutChartInputObjectSchema } from './UserUncheckedCreateWithoutChartInput.schema';
import { UserCreateOrConnectWithoutChartInputObjectSchema as UserCreateOrConnectWithoutChartInputObjectSchema } from './UserCreateOrConnectWithoutChartInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutChartInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutChartInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutChartInputObjectSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional()
}).strict();
export const UserCreateNestedOneWithoutChartInputObjectSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutChartInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateNestedOneWithoutChartInput>;
export const UserCreateNestedOneWithoutChartInputObjectZodSchema = makeSchema();
