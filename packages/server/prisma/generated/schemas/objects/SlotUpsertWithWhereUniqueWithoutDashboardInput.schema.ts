import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SlotWhereUniqueInputObjectSchema as SlotWhereUniqueInputObjectSchema } from './SlotWhereUniqueInput.schema';
import { SlotUpdateWithoutDashboardInputObjectSchema as SlotUpdateWithoutDashboardInputObjectSchema } from './SlotUpdateWithoutDashboardInput.schema';
import { SlotUncheckedUpdateWithoutDashboardInputObjectSchema as SlotUncheckedUpdateWithoutDashboardInputObjectSchema } from './SlotUncheckedUpdateWithoutDashboardInput.schema';
import { SlotCreateWithoutDashboardInputObjectSchema as SlotCreateWithoutDashboardInputObjectSchema } from './SlotCreateWithoutDashboardInput.schema';
import { SlotUncheckedCreateWithoutDashboardInputObjectSchema as SlotUncheckedCreateWithoutDashboardInputObjectSchema } from './SlotUncheckedCreateWithoutDashboardInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SlotWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => SlotUpdateWithoutDashboardInputObjectSchema), z.lazy(() => SlotUncheckedUpdateWithoutDashboardInputObjectSchema)]),
  create: z.union([z.lazy(() => SlotCreateWithoutDashboardInputObjectSchema), z.lazy(() => SlotUncheckedCreateWithoutDashboardInputObjectSchema)])
}).strict();
export const SlotUpsertWithWhereUniqueWithoutDashboardInputObjectSchema: z.ZodType<Prisma.SlotUpsertWithWhereUniqueWithoutDashboardInput> = makeSchema() as unknown as z.ZodType<Prisma.SlotUpsertWithWhereUniqueWithoutDashboardInput>;
export const SlotUpsertWithWhereUniqueWithoutDashboardInputObjectZodSchema = makeSchema();
