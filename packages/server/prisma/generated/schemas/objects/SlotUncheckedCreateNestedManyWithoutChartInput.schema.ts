import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SlotCreateWithoutChartInputObjectSchema as SlotCreateWithoutChartInputObjectSchema } from './SlotCreateWithoutChartInput.schema';
import { SlotUncheckedCreateWithoutChartInputObjectSchema as SlotUncheckedCreateWithoutChartInputObjectSchema } from './SlotUncheckedCreateWithoutChartInput.schema';
import { SlotCreateOrConnectWithoutChartInputObjectSchema as SlotCreateOrConnectWithoutChartInputObjectSchema } from './SlotCreateOrConnectWithoutChartInput.schema';
import { SlotCreateManyChartInputEnvelopeObjectSchema as SlotCreateManyChartInputEnvelopeObjectSchema } from './SlotCreateManyChartInputEnvelope.schema';
import { SlotWhereUniqueInputObjectSchema as SlotWhereUniqueInputObjectSchema } from './SlotWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => SlotCreateWithoutChartInputObjectSchema), z.lazy(() => SlotCreateWithoutChartInputObjectSchema).array(), z.lazy(() => SlotUncheckedCreateWithoutChartInputObjectSchema), z.lazy(() => SlotUncheckedCreateWithoutChartInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => SlotCreateOrConnectWithoutChartInputObjectSchema), z.lazy(() => SlotCreateOrConnectWithoutChartInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => SlotCreateManyChartInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => SlotWhereUniqueInputObjectSchema), z.lazy(() => SlotWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const SlotUncheckedCreateNestedManyWithoutChartInputObjectSchema: z.ZodType<Prisma.SlotUncheckedCreateNestedManyWithoutChartInput> = makeSchema() as unknown as z.ZodType<Prisma.SlotUncheckedCreateNestedManyWithoutChartInput>;
export const SlotUncheckedCreateNestedManyWithoutChartInputObjectZodSchema = makeSchema();
