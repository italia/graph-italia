import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DashboardWhereUniqueInputObjectSchema as DashboardWhereUniqueInputObjectSchema } from './DashboardWhereUniqueInput.schema';
import { DashboardCreateWithoutUserInputObjectSchema as DashboardCreateWithoutUserInputObjectSchema } from './DashboardCreateWithoutUserInput.schema';
import { DashboardUncheckedCreateWithoutUserInputObjectSchema as DashboardUncheckedCreateWithoutUserInputObjectSchema } from './DashboardUncheckedCreateWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => DashboardWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => DashboardCreateWithoutUserInputObjectSchema), z.lazy(() => DashboardUncheckedCreateWithoutUserInputObjectSchema)])
}).strict();
export const DashboardCreateOrConnectWithoutUserInputObjectSchema: z.ZodType<Prisma.DashboardCreateOrConnectWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.DashboardCreateOrConnectWithoutUserInput>;
export const DashboardCreateOrConnectWithoutUserInputObjectZodSchema = makeSchema();
