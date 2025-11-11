import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ChartCreateNestedManyWithoutUserInputObjectSchema as ChartCreateNestedManyWithoutUserInputObjectSchema } from './ChartCreateNestedManyWithoutUserInput.schema';
import { DashboardCreateNestedManyWithoutUserInputObjectSchema as DashboardCreateNestedManyWithoutUserInputObjectSchema } from './DashboardCreateNestedManyWithoutUserInput.schema';
import { DataSourceCreateNestedManyWithoutUserInputObjectSchema as DataSourceCreateNestedManyWithoutUserInputObjectSchema } from './DataSourceCreateNestedManyWithoutUserInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  email: z.string(),
  password: z.string(),
  verifyed: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Chart: z.lazy(() => ChartCreateNestedManyWithoutUserInputObjectSchema).optional(),
  Dashboard: z.lazy(() => DashboardCreateNestedManyWithoutUserInputObjectSchema).optional(),
  DataSource: z.lazy(() => DataSourceCreateNestedManyWithoutUserInputObjectSchema).optional()
}).strict();
export const UserCreateWithoutCodeInputObjectSchema: z.ZodType<Prisma.UserCreateWithoutCodeInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateWithoutCodeInput>;
export const UserCreateWithoutCodeInputObjectZodSchema = makeSchema();
