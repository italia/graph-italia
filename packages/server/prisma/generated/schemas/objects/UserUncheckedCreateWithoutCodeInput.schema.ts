import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ChartUncheckedCreateNestedManyWithoutUserInputObjectSchema as ChartUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './ChartUncheckedCreateNestedManyWithoutUserInput.schema';
import { DashboardUncheckedCreateNestedManyWithoutUserInputObjectSchema as DashboardUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './DashboardUncheckedCreateNestedManyWithoutUserInput.schema';
import { DataSourceUncheckedCreateNestedManyWithoutUserInputObjectSchema as DataSourceUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './DataSourceUncheckedCreateNestedManyWithoutUserInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  email: z.string(),
  password: z.string(),
  verifyed: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Chart: z.lazy(() => ChartUncheckedCreateNestedManyWithoutUserInputObjectSchema).optional(),
  Dashboard: z.lazy(() => DashboardUncheckedCreateNestedManyWithoutUserInputObjectSchema).optional(),
  DataSource: z.lazy(() => DataSourceUncheckedCreateNestedManyWithoutUserInputObjectSchema).optional()
}).strict();
export const UserUncheckedCreateWithoutCodeInputObjectSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutCodeInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUncheckedCreateWithoutCodeInput>;
export const UserUncheckedCreateWithoutCodeInputObjectZodSchema = makeSchema();
