import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ChartWhereUniqueInputObjectSchema as ChartWhereUniqueInputObjectSchema } from './ChartWhereUniqueInput.schema';
import { ChartUpdateWithoutUserInputObjectSchema as ChartUpdateWithoutUserInputObjectSchema } from './ChartUpdateWithoutUserInput.schema';
import { ChartUncheckedUpdateWithoutUserInputObjectSchema as ChartUncheckedUpdateWithoutUserInputObjectSchema } from './ChartUncheckedUpdateWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ChartWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => ChartUpdateWithoutUserInputObjectSchema), z.lazy(() => ChartUncheckedUpdateWithoutUserInputObjectSchema)])
}).strict();
export const ChartUpdateWithWhereUniqueWithoutUserInputObjectSchema: z.ZodType<Prisma.ChartUpdateWithWhereUniqueWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.ChartUpdateWithWhereUniqueWithoutUserInput>;
export const ChartUpdateWithWhereUniqueWithoutUserInputObjectZodSchema = makeSchema();
