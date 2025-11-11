import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ChartCreateNestedManyWithoutUserInputObjectSchema as ChartCreateNestedManyWithoutUserInputObjectSchema } from './ChartCreateNestedManyWithoutUserInput.schema';
import { DataSourceCreateNestedManyWithoutUserInputObjectSchema as DataSourceCreateNestedManyWithoutUserInputObjectSchema } from './DataSourceCreateNestedManyWithoutUserInput.schema';
import { CodeCreateNestedManyWithoutUserInputObjectSchema as CodeCreateNestedManyWithoutUserInputObjectSchema } from './CodeCreateNestedManyWithoutUserInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  email: z.string(),
  password: z.string(),
  verifyed: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Chart: z.lazy(() => ChartCreateNestedManyWithoutUserInputObjectSchema).optional(),
  DataSource: z.lazy(() => DataSourceCreateNestedManyWithoutUserInputObjectSchema).optional(),
  Code: z.lazy(() => CodeCreateNestedManyWithoutUserInputObjectSchema).optional()
}).strict();
export const UserCreateWithoutDashboardInputObjectSchema: z.ZodType<Prisma.UserCreateWithoutDashboardInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateWithoutDashboardInput>;
export const UserCreateWithoutDashboardInputObjectZodSchema = makeSchema();
