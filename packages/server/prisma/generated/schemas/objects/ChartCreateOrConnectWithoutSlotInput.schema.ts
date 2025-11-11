import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ChartWhereUniqueInputObjectSchema as ChartWhereUniqueInputObjectSchema } from './ChartWhereUniqueInput.schema';
import { ChartCreateWithoutSlotInputObjectSchema as ChartCreateWithoutSlotInputObjectSchema } from './ChartCreateWithoutSlotInput.schema';
import { ChartUncheckedCreateWithoutSlotInputObjectSchema as ChartUncheckedCreateWithoutSlotInputObjectSchema } from './ChartUncheckedCreateWithoutSlotInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ChartWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ChartCreateWithoutSlotInputObjectSchema), z.lazy(() => ChartUncheckedCreateWithoutSlotInputObjectSchema)])
}).strict();
export const ChartCreateOrConnectWithoutSlotInputObjectSchema: z.ZodType<Prisma.ChartCreateOrConnectWithoutSlotInput> = makeSchema() as unknown as z.ZodType<Prisma.ChartCreateOrConnectWithoutSlotInput>;
export const ChartCreateOrConnectWithoutSlotInputObjectZodSchema = makeSchema();
