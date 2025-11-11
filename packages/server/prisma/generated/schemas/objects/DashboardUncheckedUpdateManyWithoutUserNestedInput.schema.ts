import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DashboardCreateWithoutUserInputObjectSchema as DashboardCreateWithoutUserInputObjectSchema } from './DashboardCreateWithoutUserInput.schema';
import { DashboardUncheckedCreateWithoutUserInputObjectSchema as DashboardUncheckedCreateWithoutUserInputObjectSchema } from './DashboardUncheckedCreateWithoutUserInput.schema';
import { DashboardCreateOrConnectWithoutUserInputObjectSchema as DashboardCreateOrConnectWithoutUserInputObjectSchema } from './DashboardCreateOrConnectWithoutUserInput.schema';
import { DashboardUpsertWithWhereUniqueWithoutUserInputObjectSchema as DashboardUpsertWithWhereUniqueWithoutUserInputObjectSchema } from './DashboardUpsertWithWhereUniqueWithoutUserInput.schema';
import { DashboardCreateManyUserInputEnvelopeObjectSchema as DashboardCreateManyUserInputEnvelopeObjectSchema } from './DashboardCreateManyUserInputEnvelope.schema';
import { DashboardWhereUniqueInputObjectSchema as DashboardWhereUniqueInputObjectSchema } from './DashboardWhereUniqueInput.schema';
import { DashboardUpdateWithWhereUniqueWithoutUserInputObjectSchema as DashboardUpdateWithWhereUniqueWithoutUserInputObjectSchema } from './DashboardUpdateWithWhereUniqueWithoutUserInput.schema';
import { DashboardUpdateManyWithWhereWithoutUserInputObjectSchema as DashboardUpdateManyWithWhereWithoutUserInputObjectSchema } from './DashboardUpdateManyWithWhereWithoutUserInput.schema';
import { DashboardScalarWhereInputObjectSchema as DashboardScalarWhereInputObjectSchema } from './DashboardScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => DashboardCreateWithoutUserInputObjectSchema), z.lazy(() => DashboardCreateWithoutUserInputObjectSchema).array(), z.lazy(() => DashboardUncheckedCreateWithoutUserInputObjectSchema), z.lazy(() => DashboardUncheckedCreateWithoutUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => DashboardCreateOrConnectWithoutUserInputObjectSchema), z.lazy(() => DashboardCreateOrConnectWithoutUserInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => DashboardUpsertWithWhereUniqueWithoutUserInputObjectSchema), z.lazy(() => DashboardUpsertWithWhereUniqueWithoutUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => DashboardCreateManyUserInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => DashboardWhereUniqueInputObjectSchema), z.lazy(() => DashboardWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => DashboardWhereUniqueInputObjectSchema), z.lazy(() => DashboardWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => DashboardWhereUniqueInputObjectSchema), z.lazy(() => DashboardWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => DashboardWhereUniqueInputObjectSchema), z.lazy(() => DashboardWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => DashboardUpdateWithWhereUniqueWithoutUserInputObjectSchema), z.lazy(() => DashboardUpdateWithWhereUniqueWithoutUserInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => DashboardUpdateManyWithWhereWithoutUserInputObjectSchema), z.lazy(() => DashboardUpdateManyWithWhereWithoutUserInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => DashboardScalarWhereInputObjectSchema), z.lazy(() => DashboardScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const DashboardUncheckedUpdateManyWithoutUserNestedInputObjectSchema: z.ZodType<Prisma.DashboardUncheckedUpdateManyWithoutUserNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.DashboardUncheckedUpdateManyWithoutUserNestedInput>;
export const DashboardUncheckedUpdateManyWithoutUserNestedInputObjectZodSchema = makeSchema();
