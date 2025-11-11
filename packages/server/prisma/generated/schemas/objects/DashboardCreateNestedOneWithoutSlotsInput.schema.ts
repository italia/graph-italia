import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DashboardCreateWithoutSlotsInputObjectSchema as DashboardCreateWithoutSlotsInputObjectSchema } from './DashboardCreateWithoutSlotsInput.schema';
import { DashboardUncheckedCreateWithoutSlotsInputObjectSchema as DashboardUncheckedCreateWithoutSlotsInputObjectSchema } from './DashboardUncheckedCreateWithoutSlotsInput.schema';
import { DashboardCreateOrConnectWithoutSlotsInputObjectSchema as DashboardCreateOrConnectWithoutSlotsInputObjectSchema } from './DashboardCreateOrConnectWithoutSlotsInput.schema';
import { DashboardWhereUniqueInputObjectSchema as DashboardWhereUniqueInputObjectSchema } from './DashboardWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => DashboardCreateWithoutSlotsInputObjectSchema), z.lazy(() => DashboardUncheckedCreateWithoutSlotsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => DashboardCreateOrConnectWithoutSlotsInputObjectSchema).optional(),
  connect: z.lazy(() => DashboardWhereUniqueInputObjectSchema).optional()
}).strict();
export const DashboardCreateNestedOneWithoutSlotsInputObjectSchema: z.ZodType<Prisma.DashboardCreateNestedOneWithoutSlotsInput> = makeSchema() as unknown as z.ZodType<Prisma.DashboardCreateNestedOneWithoutSlotsInput>;
export const DashboardCreateNestedOneWithoutSlotsInputObjectZodSchema = makeSchema();
