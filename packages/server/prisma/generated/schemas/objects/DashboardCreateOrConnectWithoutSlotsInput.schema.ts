import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DashboardWhereUniqueInputObjectSchema as DashboardWhereUniqueInputObjectSchema } from './DashboardWhereUniqueInput.schema';
import { DashboardCreateWithoutSlotsInputObjectSchema as DashboardCreateWithoutSlotsInputObjectSchema } from './DashboardCreateWithoutSlotsInput.schema';
import { DashboardUncheckedCreateWithoutSlotsInputObjectSchema as DashboardUncheckedCreateWithoutSlotsInputObjectSchema } from './DashboardUncheckedCreateWithoutSlotsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => DashboardWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => DashboardCreateWithoutSlotsInputObjectSchema), z.lazy(() => DashboardUncheckedCreateWithoutSlotsInputObjectSchema)])
}).strict();
export const DashboardCreateOrConnectWithoutSlotsInputObjectSchema: z.ZodType<Prisma.DashboardCreateOrConnectWithoutSlotsInput> = makeSchema() as unknown as z.ZodType<Prisma.DashboardCreateOrConnectWithoutSlotsInput>;
export const DashboardCreateOrConnectWithoutSlotsInputObjectZodSchema = makeSchema();
