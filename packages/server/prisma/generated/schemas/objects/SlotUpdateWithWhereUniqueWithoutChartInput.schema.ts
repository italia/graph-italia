import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SlotWhereUniqueInputObjectSchema as SlotWhereUniqueInputObjectSchema } from './SlotWhereUniqueInput.schema';
import { SlotUpdateWithoutChartInputObjectSchema as SlotUpdateWithoutChartInputObjectSchema } from './SlotUpdateWithoutChartInput.schema';
import { SlotUncheckedUpdateWithoutChartInputObjectSchema as SlotUncheckedUpdateWithoutChartInputObjectSchema } from './SlotUncheckedUpdateWithoutChartInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SlotWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => SlotUpdateWithoutChartInputObjectSchema), z.lazy(() => SlotUncheckedUpdateWithoutChartInputObjectSchema)])
}).strict();
export const SlotUpdateWithWhereUniqueWithoutChartInputObjectSchema: z.ZodType<Prisma.SlotUpdateWithWhereUniqueWithoutChartInput> = makeSchema() as unknown as z.ZodType<Prisma.SlotUpdateWithWhereUniqueWithoutChartInput>;
export const SlotUpdateWithWhereUniqueWithoutChartInputObjectZodSchema = makeSchema();
