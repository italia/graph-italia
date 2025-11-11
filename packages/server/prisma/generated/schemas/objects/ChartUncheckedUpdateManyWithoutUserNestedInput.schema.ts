import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ChartCreateWithoutUserInputObjectSchema as ChartCreateWithoutUserInputObjectSchema } from './ChartCreateWithoutUserInput.schema';
import { ChartUncheckedCreateWithoutUserInputObjectSchema as ChartUncheckedCreateWithoutUserInputObjectSchema } from './ChartUncheckedCreateWithoutUserInput.schema';
import { ChartCreateOrConnectWithoutUserInputObjectSchema as ChartCreateOrConnectWithoutUserInputObjectSchema } from './ChartCreateOrConnectWithoutUserInput.schema';
import { ChartUpsertWithWhereUniqueWithoutUserInputObjectSchema as ChartUpsertWithWhereUniqueWithoutUserInputObjectSchema } from './ChartUpsertWithWhereUniqueWithoutUserInput.schema';
import { ChartCreateManyUserInputEnvelopeObjectSchema as ChartCreateManyUserInputEnvelopeObjectSchema } from './ChartCreateManyUserInputEnvelope.schema';
import { ChartWhereUniqueInputObjectSchema as ChartWhereUniqueInputObjectSchema } from './ChartWhereUniqueInput.schema';
import { ChartUpdateWithWhereUniqueWithoutUserInputObjectSchema as ChartUpdateWithWhereUniqueWithoutUserInputObjectSchema } from './ChartUpdateWithWhereUniqueWithoutUserInput.schema';
import { ChartUpdateManyWithWhereWithoutUserInputObjectSchema as ChartUpdateManyWithWhereWithoutUserInputObjectSchema } from './ChartUpdateManyWithWhereWithoutUserInput.schema';
import { ChartScalarWhereInputObjectSchema as ChartScalarWhereInputObjectSchema } from './ChartScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ChartCreateWithoutUserInputObjectSchema), z.lazy(() => ChartCreateWithoutUserInputObjectSchema).array(), z.lazy(() => ChartUncheckedCreateWithoutUserInputObjectSchema), z.lazy(() => ChartUncheckedCreateWithoutUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ChartCreateOrConnectWithoutUserInputObjectSchema), z.lazy(() => ChartCreateOrConnectWithoutUserInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ChartUpsertWithWhereUniqueWithoutUserInputObjectSchema), z.lazy(() => ChartUpsertWithWhereUniqueWithoutUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ChartCreateManyUserInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => ChartWhereUniqueInputObjectSchema), z.lazy(() => ChartWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ChartWhereUniqueInputObjectSchema), z.lazy(() => ChartWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ChartWhereUniqueInputObjectSchema), z.lazy(() => ChartWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ChartWhereUniqueInputObjectSchema), z.lazy(() => ChartWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => ChartUpdateWithWhereUniqueWithoutUserInputObjectSchema), z.lazy(() => ChartUpdateWithWhereUniqueWithoutUserInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ChartUpdateManyWithWhereWithoutUserInputObjectSchema), z.lazy(() => ChartUpdateManyWithWhereWithoutUserInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ChartScalarWhereInputObjectSchema), z.lazy(() => ChartScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const ChartUncheckedUpdateManyWithoutUserNestedInputObjectSchema: z.ZodType<Prisma.ChartUncheckedUpdateManyWithoutUserNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ChartUncheckedUpdateManyWithoutUserNestedInput>;
export const ChartUncheckedUpdateManyWithoutUserNestedInputObjectZodSchema = makeSchema();
