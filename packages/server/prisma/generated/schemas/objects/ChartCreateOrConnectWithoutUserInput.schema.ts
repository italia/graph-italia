import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ChartWhereUniqueInputObjectSchema as ChartWhereUniqueInputObjectSchema } from './ChartWhereUniqueInput.schema';
import { ChartCreateWithoutUserInputObjectSchema as ChartCreateWithoutUserInputObjectSchema } from './ChartCreateWithoutUserInput.schema';
import { ChartUncheckedCreateWithoutUserInputObjectSchema as ChartUncheckedCreateWithoutUserInputObjectSchema } from './ChartUncheckedCreateWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ChartWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ChartCreateWithoutUserInputObjectSchema), z.lazy(() => ChartUncheckedCreateWithoutUserInputObjectSchema)])
}).strict();
export const ChartCreateOrConnectWithoutUserInputObjectSchema: z.ZodType<Prisma.ChartCreateOrConnectWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.ChartCreateOrConnectWithoutUserInput>;
export const ChartCreateOrConnectWithoutUserInputObjectZodSchema = makeSchema();
