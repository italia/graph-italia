import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ChartFindManySchema as ChartFindManySchema } from '../findManyChart.schema';
import { DashboardFindManySchema as DashboardFindManySchema } from '../findManyDashboard.schema';
import { DataSourceFindManySchema as DataSourceFindManySchema } from '../findManyDataSource.schema';
import { CodeFindManySchema as CodeFindManySchema } from '../findManyCode.schema';
import { UserCountOutputTypeArgsObjectSchema as UserCountOutputTypeArgsObjectSchema } from './UserCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  Chart: z.union([z.boolean(), z.lazy(() => ChartFindManySchema)]).optional(),
  Dashboard: z.union([z.boolean(), z.lazy(() => DashboardFindManySchema)]).optional(),
  DataSource: z.union([z.boolean(), z.lazy(() => DataSourceFindManySchema)]).optional(),
  Code: z.union([z.boolean(), z.lazy(() => CodeFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => UserCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const UserIncludeObjectSchema: z.ZodType<Prisma.UserInclude> = makeSchema() as unknown as z.ZodType<Prisma.UserInclude>;
export const UserIncludeObjectZodSchema = makeSchema();
