import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SlotCreateWithoutChartInputObjectSchema as SlotCreateWithoutChartInputObjectSchema } from './SlotCreateWithoutChartInput.schema';
import { SlotUncheckedCreateWithoutChartInputObjectSchema as SlotUncheckedCreateWithoutChartInputObjectSchema } from './SlotUncheckedCreateWithoutChartInput.schema';
import { SlotCreateOrConnectWithoutChartInputObjectSchema as SlotCreateOrConnectWithoutChartInputObjectSchema } from './SlotCreateOrConnectWithoutChartInput.schema';
import { SlotUpsertWithWhereUniqueWithoutChartInputObjectSchema as SlotUpsertWithWhereUniqueWithoutChartInputObjectSchema } from './SlotUpsertWithWhereUniqueWithoutChartInput.schema';
import { SlotCreateManyChartInputEnvelopeObjectSchema as SlotCreateManyChartInputEnvelopeObjectSchema } from './SlotCreateManyChartInputEnvelope.schema';
import { SlotWhereUniqueInputObjectSchema as SlotWhereUniqueInputObjectSchema } from './SlotWhereUniqueInput.schema';
import { SlotUpdateWithWhereUniqueWithoutChartInputObjectSchema as SlotUpdateWithWhereUniqueWithoutChartInputObjectSchema } from './SlotUpdateWithWhereUniqueWithoutChartInput.schema';
import { SlotUpdateManyWithWhereWithoutChartInputObjectSchema as SlotUpdateManyWithWhereWithoutChartInputObjectSchema } from './SlotUpdateManyWithWhereWithoutChartInput.schema';
import { SlotScalarWhereInputObjectSchema as SlotScalarWhereInputObjectSchema } from './SlotScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => SlotCreateWithoutChartInputObjectSchema), z.lazy(() => SlotCreateWithoutChartInputObjectSchema).array(), z.lazy(() => SlotUncheckedCreateWithoutChartInputObjectSchema), z.lazy(() => SlotUncheckedCreateWithoutChartInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => SlotCreateOrConnectWithoutChartInputObjectSchema), z.lazy(() => SlotCreateOrConnectWithoutChartInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => SlotUpsertWithWhereUniqueWithoutChartInputObjectSchema), z.lazy(() => SlotUpsertWithWhereUniqueWithoutChartInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => SlotCreateManyChartInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => SlotWhereUniqueInputObjectSchema), z.lazy(() => SlotWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => SlotWhereUniqueInputObjectSchema), z.lazy(() => SlotWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => SlotWhereUniqueInputObjectSchema), z.lazy(() => SlotWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => SlotWhereUniqueInputObjectSchema), z.lazy(() => SlotWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => SlotUpdateWithWhereUniqueWithoutChartInputObjectSchema), z.lazy(() => SlotUpdateWithWhereUniqueWithoutChartInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => SlotUpdateManyWithWhereWithoutChartInputObjectSchema), z.lazy(() => SlotUpdateManyWithWhereWithoutChartInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => SlotScalarWhereInputObjectSchema), z.lazy(() => SlotScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const SlotUpdateManyWithoutChartNestedInputObjectSchema: z.ZodType<Prisma.SlotUpdateManyWithoutChartNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.SlotUpdateManyWithoutChartNestedInput>;
export const SlotUpdateManyWithoutChartNestedInputObjectZodSchema = makeSchema();
