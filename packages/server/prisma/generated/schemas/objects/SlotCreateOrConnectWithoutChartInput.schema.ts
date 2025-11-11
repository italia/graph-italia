import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SlotWhereUniqueInputObjectSchema as SlotWhereUniqueInputObjectSchema } from './SlotWhereUniqueInput.schema';
import { SlotCreateWithoutChartInputObjectSchema as SlotCreateWithoutChartInputObjectSchema } from './SlotCreateWithoutChartInput.schema';
import { SlotUncheckedCreateWithoutChartInputObjectSchema as SlotUncheckedCreateWithoutChartInputObjectSchema } from './SlotUncheckedCreateWithoutChartInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SlotWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => SlotCreateWithoutChartInputObjectSchema), z.lazy(() => SlotUncheckedCreateWithoutChartInputObjectSchema)])
}).strict();
export const SlotCreateOrConnectWithoutChartInputObjectSchema: z.ZodType<Prisma.SlotCreateOrConnectWithoutChartInput> = makeSchema() as unknown as z.ZodType<Prisma.SlotCreateOrConnectWithoutChartInput>;
export const SlotCreateOrConnectWithoutChartInputObjectZodSchema = makeSchema();
