import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SlotWhereUniqueInputObjectSchema as SlotWhereUniqueInputObjectSchema } from './SlotWhereUniqueInput.schema';
import { SlotUpdateWithoutChartInputObjectSchema as SlotUpdateWithoutChartInputObjectSchema } from './SlotUpdateWithoutChartInput.schema';
import { SlotUncheckedUpdateWithoutChartInputObjectSchema as SlotUncheckedUpdateWithoutChartInputObjectSchema } from './SlotUncheckedUpdateWithoutChartInput.schema';
import { SlotCreateWithoutChartInputObjectSchema as SlotCreateWithoutChartInputObjectSchema } from './SlotCreateWithoutChartInput.schema';
import { SlotUncheckedCreateWithoutChartInputObjectSchema as SlotUncheckedCreateWithoutChartInputObjectSchema } from './SlotUncheckedCreateWithoutChartInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SlotWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => SlotUpdateWithoutChartInputObjectSchema), z.lazy(() => SlotUncheckedUpdateWithoutChartInputObjectSchema)]),
  create: z.union([z.lazy(() => SlotCreateWithoutChartInputObjectSchema), z.lazy(() => SlotUncheckedCreateWithoutChartInputObjectSchema)])
}).strict();
export const SlotUpsertWithWhereUniqueWithoutChartInputObjectSchema: z.ZodType<Prisma.SlotUpsertWithWhereUniqueWithoutChartInput> = makeSchema() as unknown as z.ZodType<Prisma.SlotUpsertWithWhereUniqueWithoutChartInput>;
export const SlotUpsertWithWhereUniqueWithoutChartInputObjectZodSchema = makeSchema();
