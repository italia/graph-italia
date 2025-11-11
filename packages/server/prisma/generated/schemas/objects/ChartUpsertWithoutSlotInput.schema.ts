import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ChartUpdateWithoutSlotInputObjectSchema as ChartUpdateWithoutSlotInputObjectSchema } from './ChartUpdateWithoutSlotInput.schema';
import { ChartUncheckedUpdateWithoutSlotInputObjectSchema as ChartUncheckedUpdateWithoutSlotInputObjectSchema } from './ChartUncheckedUpdateWithoutSlotInput.schema';
import { ChartCreateWithoutSlotInputObjectSchema as ChartCreateWithoutSlotInputObjectSchema } from './ChartCreateWithoutSlotInput.schema';
import { ChartUncheckedCreateWithoutSlotInputObjectSchema as ChartUncheckedCreateWithoutSlotInputObjectSchema } from './ChartUncheckedCreateWithoutSlotInput.schema';
import { ChartWhereInputObjectSchema as ChartWhereInputObjectSchema } from './ChartWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ChartUpdateWithoutSlotInputObjectSchema), z.lazy(() => ChartUncheckedUpdateWithoutSlotInputObjectSchema)]),
  create: z.union([z.lazy(() => ChartCreateWithoutSlotInputObjectSchema), z.lazy(() => ChartUncheckedCreateWithoutSlotInputObjectSchema)]),
  where: z.lazy(() => ChartWhereInputObjectSchema).optional()
}).strict();
export const ChartUpsertWithoutSlotInputObjectSchema: z.ZodType<Prisma.ChartUpsertWithoutSlotInput> = makeSchema() as unknown as z.ZodType<Prisma.ChartUpsertWithoutSlotInput>;
export const ChartUpsertWithoutSlotInputObjectZodSchema = makeSchema();
