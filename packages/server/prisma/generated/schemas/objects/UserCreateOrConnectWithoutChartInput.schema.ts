import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutChartInputObjectSchema as UserCreateWithoutChartInputObjectSchema } from './UserCreateWithoutChartInput.schema';
import { UserUncheckedCreateWithoutChartInputObjectSchema as UserUncheckedCreateWithoutChartInputObjectSchema } from './UserUncheckedCreateWithoutChartInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UserCreateWithoutChartInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutChartInputObjectSchema)])
}).strict();
export const UserCreateOrConnectWithoutChartInputObjectSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutChartInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateOrConnectWithoutChartInput>;
export const UserCreateOrConnectWithoutChartInputObjectZodSchema = makeSchema();
