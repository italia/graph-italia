import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SlotCreateWithoutDashboardInputObjectSchema as SlotCreateWithoutDashboardInputObjectSchema } from './SlotCreateWithoutDashboardInput.schema';
import { SlotUncheckedCreateWithoutDashboardInputObjectSchema as SlotUncheckedCreateWithoutDashboardInputObjectSchema } from './SlotUncheckedCreateWithoutDashboardInput.schema';
import { SlotCreateOrConnectWithoutDashboardInputObjectSchema as SlotCreateOrConnectWithoutDashboardInputObjectSchema } from './SlotCreateOrConnectWithoutDashboardInput.schema';
import { SlotUpsertWithWhereUniqueWithoutDashboardInputObjectSchema as SlotUpsertWithWhereUniqueWithoutDashboardInputObjectSchema } from './SlotUpsertWithWhereUniqueWithoutDashboardInput.schema';
import { SlotCreateManyDashboardInputEnvelopeObjectSchema as SlotCreateManyDashboardInputEnvelopeObjectSchema } from './SlotCreateManyDashboardInputEnvelope.schema';
import { SlotWhereUniqueInputObjectSchema as SlotWhereUniqueInputObjectSchema } from './SlotWhereUniqueInput.schema';
import { SlotUpdateWithWhereUniqueWithoutDashboardInputObjectSchema as SlotUpdateWithWhereUniqueWithoutDashboardInputObjectSchema } from './SlotUpdateWithWhereUniqueWithoutDashboardInput.schema';
import { SlotUpdateManyWithWhereWithoutDashboardInputObjectSchema as SlotUpdateManyWithWhereWithoutDashboardInputObjectSchema } from './SlotUpdateManyWithWhereWithoutDashboardInput.schema';
import { SlotScalarWhereInputObjectSchema as SlotScalarWhereInputObjectSchema } from './SlotScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => SlotCreateWithoutDashboardInputObjectSchema), z.lazy(() => SlotCreateWithoutDashboardInputObjectSchema).array(), z.lazy(() => SlotUncheckedCreateWithoutDashboardInputObjectSchema), z.lazy(() => SlotUncheckedCreateWithoutDashboardInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => SlotCreateOrConnectWithoutDashboardInputObjectSchema), z.lazy(() => SlotCreateOrConnectWithoutDashboardInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => SlotUpsertWithWhereUniqueWithoutDashboardInputObjectSchema), z.lazy(() => SlotUpsertWithWhereUniqueWithoutDashboardInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => SlotCreateManyDashboardInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => SlotWhereUniqueInputObjectSchema), z.lazy(() => SlotWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => SlotWhereUniqueInputObjectSchema), z.lazy(() => SlotWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => SlotWhereUniqueInputObjectSchema), z.lazy(() => SlotWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => SlotWhereUniqueInputObjectSchema), z.lazy(() => SlotWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => SlotUpdateWithWhereUniqueWithoutDashboardInputObjectSchema), z.lazy(() => SlotUpdateWithWhereUniqueWithoutDashboardInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => SlotUpdateManyWithWhereWithoutDashboardInputObjectSchema), z.lazy(() => SlotUpdateManyWithWhereWithoutDashboardInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => SlotScalarWhereInputObjectSchema), z.lazy(() => SlotScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const SlotUpdateManyWithoutDashboardNestedInputObjectSchema: z.ZodType<Prisma.SlotUpdateManyWithoutDashboardNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.SlotUpdateManyWithoutDashboardNestedInput>;
export const SlotUpdateManyWithoutDashboardNestedInputObjectZodSchema = makeSchema();
