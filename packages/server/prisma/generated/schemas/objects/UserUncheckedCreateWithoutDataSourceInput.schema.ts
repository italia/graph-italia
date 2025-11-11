import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ChartUncheckedCreateNestedManyWithoutUserInputObjectSchema as ChartUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './ChartUncheckedCreateNestedManyWithoutUserInput.schema';
import { DashboardUncheckedCreateNestedManyWithoutUserInputObjectSchema as DashboardUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './DashboardUncheckedCreateNestedManyWithoutUserInput.schema';
import { CodeUncheckedCreateNestedManyWithoutUserInputObjectSchema as CodeUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './CodeUncheckedCreateNestedManyWithoutUserInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  email: z.string(),
  password: z.string(),
  verifyed: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Chart: z.lazy(() => ChartUncheckedCreateNestedManyWithoutUserInputObjectSchema).optional(),
  Dashboard: z.lazy(() => DashboardUncheckedCreateNestedManyWithoutUserInputObjectSchema).optional(),
  Code: z.lazy(() => CodeUncheckedCreateNestedManyWithoutUserInputObjectSchema).optional()
}).strict();
export const UserUncheckedCreateWithoutDataSourceInputObjectSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutDataSourceInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUncheckedCreateWithoutDataSourceInput>;
export const UserUncheckedCreateWithoutDataSourceInputObjectZodSchema = makeSchema();
