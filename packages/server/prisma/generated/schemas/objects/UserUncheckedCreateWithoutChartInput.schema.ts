import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DashboardUncheckedCreateNestedManyWithoutUserInputObjectSchema as DashboardUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './DashboardUncheckedCreateNestedManyWithoutUserInput.schema';
import { DataSourceUncheckedCreateNestedManyWithoutUserInputObjectSchema as DataSourceUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './DataSourceUncheckedCreateNestedManyWithoutUserInput.schema';
import { CodeUncheckedCreateNestedManyWithoutUserInputObjectSchema as CodeUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './CodeUncheckedCreateNestedManyWithoutUserInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  email: z.string(),
  password: z.string(),
  verifyed: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Dashboard: z.lazy(() => DashboardUncheckedCreateNestedManyWithoutUserInputObjectSchema).optional(),
  DataSource: z.lazy(() => DataSourceUncheckedCreateNestedManyWithoutUserInputObjectSchema).optional(),
  Code: z.lazy(() => CodeUncheckedCreateNestedManyWithoutUserInputObjectSchema).optional()
}).strict();
export const UserUncheckedCreateWithoutChartInputObjectSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutChartInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUncheckedCreateWithoutChartInput>;
export const UserUncheckedCreateWithoutChartInputObjectZodSchema = makeSchema();
