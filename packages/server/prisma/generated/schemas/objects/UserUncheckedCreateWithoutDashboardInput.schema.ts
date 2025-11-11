import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ChartUncheckedCreateNestedManyWithoutUserInputObjectSchema as ChartUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './ChartUncheckedCreateNestedManyWithoutUserInput.schema';
import { DataSourceUncheckedCreateNestedManyWithoutUserInputObjectSchema as DataSourceUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './DataSourceUncheckedCreateNestedManyWithoutUserInput.schema';
import { CodeUncheckedCreateNestedManyWithoutUserInputObjectSchema as CodeUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './CodeUncheckedCreateNestedManyWithoutUserInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  email: z.string(),
  password: z.string(),
  verifyed: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Chart: z.lazy(() => ChartUncheckedCreateNestedManyWithoutUserInputObjectSchema).optional(),
  DataSource: z.lazy(() => DataSourceUncheckedCreateNestedManyWithoutUserInputObjectSchema).optional(),
  Code: z.lazy(() => CodeUncheckedCreateNestedManyWithoutUserInputObjectSchema).optional()
}).strict();
export const UserUncheckedCreateWithoutDashboardInputObjectSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutDashboardInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUncheckedCreateWithoutDashboardInput>;
export const UserUncheckedCreateWithoutDashboardInputObjectZodSchema = makeSchema();
