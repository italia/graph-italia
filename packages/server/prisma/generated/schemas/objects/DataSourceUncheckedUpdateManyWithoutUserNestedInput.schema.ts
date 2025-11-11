import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DataSourceCreateWithoutUserInputObjectSchema as DataSourceCreateWithoutUserInputObjectSchema } from './DataSourceCreateWithoutUserInput.schema';
import { DataSourceUncheckedCreateWithoutUserInputObjectSchema as DataSourceUncheckedCreateWithoutUserInputObjectSchema } from './DataSourceUncheckedCreateWithoutUserInput.schema';
import { DataSourceCreateOrConnectWithoutUserInputObjectSchema as DataSourceCreateOrConnectWithoutUserInputObjectSchema } from './DataSourceCreateOrConnectWithoutUserInput.schema';
import { DataSourceUpsertWithWhereUniqueWithoutUserInputObjectSchema as DataSourceUpsertWithWhereUniqueWithoutUserInputObjectSchema } from './DataSourceUpsertWithWhereUniqueWithoutUserInput.schema';
import { DataSourceCreateManyUserInputEnvelopeObjectSchema as DataSourceCreateManyUserInputEnvelopeObjectSchema } from './DataSourceCreateManyUserInputEnvelope.schema';
import { DataSourceWhereUniqueInputObjectSchema as DataSourceWhereUniqueInputObjectSchema } from './DataSourceWhereUniqueInput.schema';
import { DataSourceUpdateWithWhereUniqueWithoutUserInputObjectSchema as DataSourceUpdateWithWhereUniqueWithoutUserInputObjectSchema } from './DataSourceUpdateWithWhereUniqueWithoutUserInput.schema';
import { DataSourceUpdateManyWithWhereWithoutUserInputObjectSchema as DataSourceUpdateManyWithWhereWithoutUserInputObjectSchema } from './DataSourceUpdateManyWithWhereWithoutUserInput.schema';
import { DataSourceScalarWhereInputObjectSchema as DataSourceScalarWhereInputObjectSchema } from './DataSourceScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => DataSourceCreateWithoutUserInputObjectSchema), z.lazy(() => DataSourceCreateWithoutUserInputObjectSchema).array(), z.lazy(() => DataSourceUncheckedCreateWithoutUserInputObjectSchema), z.lazy(() => DataSourceUncheckedCreateWithoutUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => DataSourceCreateOrConnectWithoutUserInputObjectSchema), z.lazy(() => DataSourceCreateOrConnectWithoutUserInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => DataSourceUpsertWithWhereUniqueWithoutUserInputObjectSchema), z.lazy(() => DataSourceUpsertWithWhereUniqueWithoutUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => DataSourceCreateManyUserInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => DataSourceWhereUniqueInputObjectSchema), z.lazy(() => DataSourceWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => DataSourceWhereUniqueInputObjectSchema), z.lazy(() => DataSourceWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => DataSourceWhereUniqueInputObjectSchema), z.lazy(() => DataSourceWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => DataSourceWhereUniqueInputObjectSchema), z.lazy(() => DataSourceWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => DataSourceUpdateWithWhereUniqueWithoutUserInputObjectSchema), z.lazy(() => DataSourceUpdateWithWhereUniqueWithoutUserInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => DataSourceUpdateManyWithWhereWithoutUserInputObjectSchema), z.lazy(() => DataSourceUpdateManyWithWhereWithoutUserInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => DataSourceScalarWhereInputObjectSchema), z.lazy(() => DataSourceScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const DataSourceUncheckedUpdateManyWithoutUserNestedInputObjectSchema: z.ZodType<Prisma.DataSourceUncheckedUpdateManyWithoutUserNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.DataSourceUncheckedUpdateManyWithoutUserNestedInput>;
export const DataSourceUncheckedUpdateManyWithoutUserNestedInputObjectZodSchema = makeSchema();
