import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ChartCreateNestedManyWithoutUserInputObjectSchema as ChartCreateNestedManyWithoutUserInputObjectSchema } from './ChartCreateNestedManyWithoutUserInput.schema';
import { DashboardCreateNestedManyWithoutUserInputObjectSchema as DashboardCreateNestedManyWithoutUserInputObjectSchema } from './DashboardCreateNestedManyWithoutUserInput.schema';
import { CodeCreateNestedManyWithoutUserInputObjectSchema as CodeCreateNestedManyWithoutUserInputObjectSchema } from './CodeCreateNestedManyWithoutUserInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  email: z.string(),
  password: z.string(),
  verifyed: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Chart: z.lazy(() => ChartCreateNestedManyWithoutUserInputObjectSchema).optional(),
  Dashboard: z.lazy(() => DashboardCreateNestedManyWithoutUserInputObjectSchema).optional(),
  Code: z.lazy(() => CodeCreateNestedManyWithoutUserInputObjectSchema).optional()
}).strict();
export const UserCreateWithoutDataSourceInputObjectSchema: z.ZodType<Prisma.UserCreateWithoutDataSourceInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateWithoutDataSourceInput>;
export const UserCreateWithoutDataSourceInputObjectZodSchema = makeSchema();
