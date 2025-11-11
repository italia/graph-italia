import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DashboardWhereInputObjectSchema as DashboardWhereInputObjectSchema } from './DashboardWhereInput.schema';
import { DashboardUpdateWithoutSlotsInputObjectSchema as DashboardUpdateWithoutSlotsInputObjectSchema } from './DashboardUpdateWithoutSlotsInput.schema';
import { DashboardUncheckedUpdateWithoutSlotsInputObjectSchema as DashboardUncheckedUpdateWithoutSlotsInputObjectSchema } from './DashboardUncheckedUpdateWithoutSlotsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => DashboardWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => DashboardUpdateWithoutSlotsInputObjectSchema), z.lazy(() => DashboardUncheckedUpdateWithoutSlotsInputObjectSchema)])
}).strict();
export const DashboardUpdateToOneWithWhereWithoutSlotsInputObjectSchema: z.ZodType<Prisma.DashboardUpdateToOneWithWhereWithoutSlotsInput> = makeSchema() as unknown as z.ZodType<Prisma.DashboardUpdateToOneWithWhereWithoutSlotsInput>;
export const DashboardUpdateToOneWithWhereWithoutSlotsInputObjectZodSchema = makeSchema();
