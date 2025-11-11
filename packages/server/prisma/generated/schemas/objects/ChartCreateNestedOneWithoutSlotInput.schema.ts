import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ChartCreateWithoutSlotInputObjectSchema as ChartCreateWithoutSlotInputObjectSchema } from './ChartCreateWithoutSlotInput.schema';
import { ChartUncheckedCreateWithoutSlotInputObjectSchema as ChartUncheckedCreateWithoutSlotInputObjectSchema } from './ChartUncheckedCreateWithoutSlotInput.schema';
import { ChartCreateOrConnectWithoutSlotInputObjectSchema as ChartCreateOrConnectWithoutSlotInputObjectSchema } from './ChartCreateOrConnectWithoutSlotInput.schema';
import { ChartWhereUniqueInputObjectSchema as ChartWhereUniqueInputObjectSchema } from './ChartWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ChartCreateWithoutSlotInputObjectSchema), z.lazy(() => ChartUncheckedCreateWithoutSlotInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ChartCreateOrConnectWithoutSlotInputObjectSchema).optional(),
  connect: z.lazy(() => ChartWhereUniqueInputObjectSchema).optional()
}).strict();
export const ChartCreateNestedOneWithoutSlotInputObjectSchema: z.ZodType<Prisma.ChartCreateNestedOneWithoutSlotInput> = makeSchema() as unknown as z.ZodType<Prisma.ChartCreateNestedOneWithoutSlotInput>;
export const ChartCreateNestedOneWithoutSlotInputObjectZodSchema = makeSchema();
