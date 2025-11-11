import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserUpdateWithoutChartInputObjectSchema as UserUpdateWithoutChartInputObjectSchema } from './UserUpdateWithoutChartInput.schema';
import { UserUncheckedUpdateWithoutChartInputObjectSchema as UserUncheckedUpdateWithoutChartInputObjectSchema } from './UserUncheckedUpdateWithoutChartInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => UserUpdateWithoutChartInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutChartInputObjectSchema)])
}).strict();
export const UserUpdateToOneWithWhereWithoutChartInputObjectSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutChartInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutChartInput>;
export const UserUpdateToOneWithWhereWithoutChartInputObjectZodSchema = makeSchema();
