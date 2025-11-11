import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SlotCreateWithoutDashboardInputObjectSchema as SlotCreateWithoutDashboardInputObjectSchema } from './SlotCreateWithoutDashboardInput.schema';
import { SlotUncheckedCreateWithoutDashboardInputObjectSchema as SlotUncheckedCreateWithoutDashboardInputObjectSchema } from './SlotUncheckedCreateWithoutDashboardInput.schema';
import { SlotCreateOrConnectWithoutDashboardInputObjectSchema as SlotCreateOrConnectWithoutDashboardInputObjectSchema } from './SlotCreateOrConnectWithoutDashboardInput.schema';
import { SlotCreateManyDashboardInputEnvelopeObjectSchema as SlotCreateManyDashboardInputEnvelopeObjectSchema } from './SlotCreateManyDashboardInputEnvelope.schema';
import { SlotWhereUniqueInputObjectSchema as SlotWhereUniqueInputObjectSchema } from './SlotWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => SlotCreateWithoutDashboardInputObjectSchema), z.lazy(() => SlotCreateWithoutDashboardInputObjectSchema).array(), z.lazy(() => SlotUncheckedCreateWithoutDashboardInputObjectSchema), z.lazy(() => SlotUncheckedCreateWithoutDashboardInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => SlotCreateOrConnectWithoutDashboardInputObjectSchema), z.lazy(() => SlotCreateOrConnectWithoutDashboardInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => SlotCreateManyDashboardInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => SlotWhereUniqueInputObjectSchema), z.lazy(() => SlotWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const SlotUncheckedCreateNestedManyWithoutDashboardInputObjectSchema: z.ZodType<Prisma.SlotUncheckedCreateNestedManyWithoutDashboardInput> = makeSchema() as unknown as z.ZodType<Prisma.SlotUncheckedCreateNestedManyWithoutDashboardInput>;
export const SlotUncheckedCreateNestedManyWithoutDashboardInputObjectZodSchema = makeSchema();
