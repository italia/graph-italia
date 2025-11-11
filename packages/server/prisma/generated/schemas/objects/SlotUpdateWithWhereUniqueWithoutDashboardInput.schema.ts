import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SlotWhereUniqueInputObjectSchema as SlotWhereUniqueInputObjectSchema } from './SlotWhereUniqueInput.schema';
import { SlotUpdateWithoutDashboardInputObjectSchema as SlotUpdateWithoutDashboardInputObjectSchema } from './SlotUpdateWithoutDashboardInput.schema';
import { SlotUncheckedUpdateWithoutDashboardInputObjectSchema as SlotUncheckedUpdateWithoutDashboardInputObjectSchema } from './SlotUncheckedUpdateWithoutDashboardInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SlotWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => SlotUpdateWithoutDashboardInputObjectSchema), z.lazy(() => SlotUncheckedUpdateWithoutDashboardInputObjectSchema)])
}).strict();
export const SlotUpdateWithWhereUniqueWithoutDashboardInputObjectSchema: z.ZodType<Prisma.SlotUpdateWithWhereUniqueWithoutDashboardInput> = makeSchema() as unknown as z.ZodType<Prisma.SlotUpdateWithWhereUniqueWithoutDashboardInput>;
export const SlotUpdateWithWhereUniqueWithoutDashboardInputObjectZodSchema = makeSchema();
