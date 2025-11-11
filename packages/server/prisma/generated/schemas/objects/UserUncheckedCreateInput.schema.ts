import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ChartUncheckedCreateNestedManyWithoutUserInputObjectSchema as ChartUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './ChartUncheckedCreateNestedManyWithoutUserInput.schema';
import { DashboardUncheckedCreateNestedManyWithoutUserInputObjectSchema as DashboardUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './DashboardUncheckedCreateNestedManyWithoutUserInput.schema';
import { DataSourceUncheckedCreateNestedManyWithoutUserInputObjectSchema as DataSourceUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './DataSourceUncheckedCreateNestedManyWithoutUserInput.schema';
import { CodeUncheckedCreateNestedManyWithoutUserInputObjectSchema as CodeUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './CodeUncheckedCreateNestedManyWithoutUserInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  email: z.string(),
  password: z.string(),
  verifyed: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  Chart: z.lazy(() => ChartUncheckedCreateNestedManyWithoutUserInputObjectSchema),
  Dashboard: z.lazy(() => DashboardUncheckedCreateNestedManyWithoutUserInputObjectSchema),
  DataSource: z.lazy(() => DataSourceUncheckedCreateNestedManyWithoutUserInputObjectSchema),
  Code: z.lazy(() => CodeUncheckedCreateNestedManyWithoutUserInputObjectSchema)
}).strict();
export const UserUncheckedCreateInputObjectSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUncheckedCreateInput>;
export const UserUncheckedCreateInputObjectZodSchema = makeSchema();
