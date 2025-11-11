import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ChartWhereUniqueInputObjectSchema as ChartWhereUniqueInputObjectSchema } from './ChartWhereUniqueInput.schema';
import { ChartUpdateWithoutUserInputObjectSchema as ChartUpdateWithoutUserInputObjectSchema } from './ChartUpdateWithoutUserInput.schema';
import { ChartUncheckedUpdateWithoutUserInputObjectSchema as ChartUncheckedUpdateWithoutUserInputObjectSchema } from './ChartUncheckedUpdateWithoutUserInput.schema';
import { ChartCreateWithoutUserInputObjectSchema as ChartCreateWithoutUserInputObjectSchema } from './ChartCreateWithoutUserInput.schema';
import { ChartUncheckedCreateWithoutUserInputObjectSchema as ChartUncheckedCreateWithoutUserInputObjectSchema } from './ChartUncheckedCreateWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ChartWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => ChartUpdateWithoutUserInputObjectSchema), z.lazy(() => ChartUncheckedUpdateWithoutUserInputObjectSchema)]),
  create: z.union([z.lazy(() => ChartCreateWithoutUserInputObjectSchema), z.lazy(() => ChartUncheckedCreateWithoutUserInputObjectSchema)])
}).strict();
export const ChartUpsertWithWhereUniqueWithoutUserInputObjectSchema: z.ZodType<Prisma.ChartUpsertWithWhereUniqueWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.ChartUpsertWithWhereUniqueWithoutUserInput>;
export const ChartUpsertWithWhereUniqueWithoutUserInputObjectZodSchema = makeSchema();
