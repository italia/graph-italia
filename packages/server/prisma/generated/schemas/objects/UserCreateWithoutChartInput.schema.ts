import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DashboardCreateNestedManyWithoutUserInputObjectSchema as DashboardCreateNestedManyWithoutUserInputObjectSchema } from './DashboardCreateNestedManyWithoutUserInput.schema';
import { DataSourceCreateNestedManyWithoutUserInputObjectSchema as DataSourceCreateNestedManyWithoutUserInputObjectSchema } from './DataSourceCreateNestedManyWithoutUserInput.schema';
import { CodeCreateNestedManyWithoutUserInputObjectSchema as CodeCreateNestedManyWithoutUserInputObjectSchema } from './CodeCreateNestedManyWithoutUserInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  email: z.string(),
  password: z.string(),
  verifyed: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Dashboard: z.lazy(() => DashboardCreateNestedManyWithoutUserInputObjectSchema).optional(),
  DataSource: z.lazy(() => DataSourceCreateNestedManyWithoutUserInputObjectSchema).optional(),
  Code: z.lazy(() => CodeCreateNestedManyWithoutUserInputObjectSchema).optional()
}).strict();
export const UserCreateWithoutChartInputObjectSchema: z.ZodType<Prisma.UserCreateWithoutChartInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateWithoutChartInput>;
export const UserCreateWithoutChartInputObjectZodSchema = makeSchema();
