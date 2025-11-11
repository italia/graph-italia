import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ChartWhereInputObjectSchema as ChartWhereInputObjectSchema } from './ChartWhereInput.schema';
import { ChartUpdateWithoutSlotInputObjectSchema as ChartUpdateWithoutSlotInputObjectSchema } from './ChartUpdateWithoutSlotInput.schema';
import { ChartUncheckedUpdateWithoutSlotInputObjectSchema as ChartUncheckedUpdateWithoutSlotInputObjectSchema } from './ChartUncheckedUpdateWithoutSlotInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ChartWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ChartUpdateWithoutSlotInputObjectSchema), z.lazy(() => ChartUncheckedUpdateWithoutSlotInputObjectSchema)])
}).strict();
export const ChartUpdateToOneWithWhereWithoutSlotInputObjectSchema: z.ZodType<Prisma.ChartUpdateToOneWithWhereWithoutSlotInput> = makeSchema() as unknown as z.ZodType<Prisma.ChartUpdateToOneWithWhereWithoutSlotInput>;
export const ChartUpdateToOneWithWhereWithoutSlotInputObjectZodSchema = makeSchema();
