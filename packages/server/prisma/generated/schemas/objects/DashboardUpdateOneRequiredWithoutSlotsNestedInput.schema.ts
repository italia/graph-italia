import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DashboardCreateWithoutSlotsInputObjectSchema as DashboardCreateWithoutSlotsInputObjectSchema } from './DashboardCreateWithoutSlotsInput.schema';
import { DashboardUncheckedCreateWithoutSlotsInputObjectSchema as DashboardUncheckedCreateWithoutSlotsInputObjectSchema } from './DashboardUncheckedCreateWithoutSlotsInput.schema';
import { DashboardCreateOrConnectWithoutSlotsInputObjectSchema as DashboardCreateOrConnectWithoutSlotsInputObjectSchema } from './DashboardCreateOrConnectWithoutSlotsInput.schema';
import { DashboardUpsertWithoutSlotsInputObjectSchema as DashboardUpsertWithoutSlotsInputObjectSchema } from './DashboardUpsertWithoutSlotsInput.schema';
import { DashboardWhereUniqueInputObjectSchema as DashboardWhereUniqueInputObjectSchema } from './DashboardWhereUniqueInput.schema';
import { DashboardUpdateToOneWithWhereWithoutSlotsInputObjectSchema as DashboardUpdateToOneWithWhereWithoutSlotsInputObjectSchema } from './DashboardUpdateToOneWithWhereWithoutSlotsInput.schema';
import { DashboardUpdateWithoutSlotsInputObjectSchema as DashboardUpdateWithoutSlotsInputObjectSchema } from './DashboardUpdateWithoutSlotsInput.schema';
import { DashboardUncheckedUpdateWithoutSlotsInputObjectSchema as DashboardUncheckedUpdateWithoutSlotsInputObjectSchema } from './DashboardUncheckedUpdateWithoutSlotsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => DashboardCreateWithoutSlotsInputObjectSchema), z.lazy(() => DashboardUncheckedCreateWithoutSlotsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => DashboardCreateOrConnectWithoutSlotsInputObjectSchema).optional(),
  upsert: z.lazy(() => DashboardUpsertWithoutSlotsInputObjectSchema).optional(),
  connect: z.lazy(() => DashboardWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => DashboardUpdateToOneWithWhereWithoutSlotsInputObjectSchema), z.lazy(() => DashboardUpdateWithoutSlotsInputObjectSchema), z.lazy(() => DashboardUncheckedUpdateWithoutSlotsInputObjectSchema)]).optional()
}).strict();
export const DashboardUpdateOneRequiredWithoutSlotsNestedInputObjectSchema: z.ZodType<Prisma.DashboardUpdateOneRequiredWithoutSlotsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.DashboardUpdateOneRequiredWithoutSlotsNestedInput>;
export const DashboardUpdateOneRequiredWithoutSlotsNestedInputObjectZodSchema = makeSchema();
