import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ChartCreateNestedManyWithoutUserInputObjectSchema as ChartCreateNestedManyWithoutUserInputObjectSchema } from './ChartCreateNestedManyWithoutUserInput.schema';
import { DashboardCreateNestedManyWithoutUserInputObjectSchema as DashboardCreateNestedManyWithoutUserInputObjectSchema } from './DashboardCreateNestedManyWithoutUserInput.schema';
import { DataSourceCreateNestedManyWithoutUserInputObjectSchema as DataSourceCreateNestedManyWithoutUserInputObjectSchema } from './DataSourceCreateNestedManyWithoutUserInput.schema';
import { CodeCreateNestedManyWithoutUserInputObjectSchema as CodeCreateNestedManyWithoutUserInputObjectSchema } from './CodeCreateNestedManyWithoutUserInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  email: z.string(),
  password: z.string(),
  verifyed: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  Chart: z.lazy(() => ChartCreateNestedManyWithoutUserInputObjectSchema),
  Dashboard: z.lazy(() => DashboardCreateNestedManyWithoutUserInputObjectSchema),
  DataSource: z.lazy(() => DataSourceCreateNestedManyWithoutUserInputObjectSchema),
  Code: z.lazy(() => CodeCreateNestedManyWithoutUserInputObjectSchema)
}).strict();
export const UserCreateInputObjectSchema: z.ZodType<Prisma.UserCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateInput>;
export const UserCreateInputObjectZodSchema = makeSchema();
