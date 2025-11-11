import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SlotWhereUniqueInputObjectSchema as SlotWhereUniqueInputObjectSchema } from './SlotWhereUniqueInput.schema';
import { SlotCreateWithoutDashboardInputObjectSchema as SlotCreateWithoutDashboardInputObjectSchema } from './SlotCreateWithoutDashboardInput.schema';
import { SlotUncheckedCreateWithoutDashboardInputObjectSchema as SlotUncheckedCreateWithoutDashboardInputObjectSchema } from './SlotUncheckedCreateWithoutDashboardInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SlotWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => SlotCreateWithoutDashboardInputObjectSchema), z.lazy(() => SlotUncheckedCreateWithoutDashboardInputObjectSchema)])
}).strict();
export const SlotCreateOrConnectWithoutDashboardInputObjectSchema: z.ZodType<Prisma.SlotCreateOrConnectWithoutDashboardInput> = makeSchema() as unknown as z.ZodType<Prisma.SlotCreateOrConnectWithoutDashboardInput>;
export const SlotCreateOrConnectWithoutDashboardInputObjectZodSchema = makeSchema();
