import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ChartCreateWithoutUserInputObjectSchema as ChartCreateWithoutUserInputObjectSchema } from './ChartCreateWithoutUserInput.schema';
import { ChartUncheckedCreateWithoutUserInputObjectSchema as ChartUncheckedCreateWithoutUserInputObjectSchema } from './ChartUncheckedCreateWithoutUserInput.schema';
import { ChartCreateOrConnectWithoutUserInputObjectSchema as ChartCreateOrConnectWithoutUserInputObjectSchema } from './ChartCreateOrConnectWithoutUserInput.schema';
import { ChartCreateManyUserInputEnvelopeObjectSchema as ChartCreateManyUserInputEnvelopeObjectSchema } from './ChartCreateManyUserInputEnvelope.schema';
import { ChartWhereUniqueInputObjectSchema as ChartWhereUniqueInputObjectSchema } from './ChartWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ChartCreateWithoutUserInputObjectSchema), z.lazy(() => ChartCreateWithoutUserInputObjectSchema).array(), z.lazy(() => ChartUncheckedCreateWithoutUserInputObjectSchema), z.lazy(() => ChartUncheckedCreateWithoutUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ChartCreateOrConnectWithoutUserInputObjectSchema), z.lazy(() => ChartCreateOrConnectWithoutUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ChartCreateManyUserInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => ChartWhereUniqueInputObjectSchema), z.lazy(() => ChartWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const ChartCreateNestedManyWithoutUserInputObjectSchema: z.ZodType<Prisma.ChartCreateNestedManyWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.ChartCreateNestedManyWithoutUserInput>;
export const ChartCreateNestedManyWithoutUserInputObjectZodSchema = makeSchema();
