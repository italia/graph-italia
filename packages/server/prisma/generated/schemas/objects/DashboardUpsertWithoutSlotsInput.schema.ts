import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DashboardUpdateWithoutSlotsInputObjectSchema as DashboardUpdateWithoutSlotsInputObjectSchema } from './DashboardUpdateWithoutSlotsInput.schema';
import { DashboardUncheckedUpdateWithoutSlotsInputObjectSchema as DashboardUncheckedUpdateWithoutSlotsInputObjectSchema } from './DashboardUncheckedUpdateWithoutSlotsInput.schema';
import { DashboardCreateWithoutSlotsInputObjectSchema as DashboardCreateWithoutSlotsInputObjectSchema } from './DashboardCreateWithoutSlotsInput.schema';
import { DashboardUncheckedCreateWithoutSlotsInputObjectSchema as DashboardUncheckedCreateWithoutSlotsInputObjectSchema } from './DashboardUncheckedCreateWithoutSlotsInput.schema';
import { DashboardWhereInputObjectSchema as DashboardWhereInputObjectSchema } from './DashboardWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => DashboardUpdateWithoutSlotsInputObjectSchema), z.lazy(() => DashboardUncheckedUpdateWithoutSlotsInputObjectSchema)]),
  create: z.union([z.lazy(() => DashboardCreateWithoutSlotsInputObjectSchema), z.lazy(() => DashboardUncheckedCreateWithoutSlotsInputObjectSchema)]),
  where: z.lazy(() => DashboardWhereInputObjectSchema).optional()
}).strict();
export const DashboardUpsertWithoutSlotsInputObjectSchema: z.ZodType<Prisma.DashboardUpsertWithoutSlotsInput> = makeSchema() as unknown as z.ZodType<Prisma.DashboardUpsertWithoutSlotsInput>;
export const DashboardUpsertWithoutSlotsInputObjectZodSchema = makeSchema();
