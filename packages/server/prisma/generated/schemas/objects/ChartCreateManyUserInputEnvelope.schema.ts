import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ChartCreateManyUserInputObjectSchema as ChartCreateManyUserInputObjectSchema } from './ChartCreateManyUserInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => ChartCreateManyUserInputObjectSchema), z.lazy(() => ChartCreateManyUserInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const ChartCreateManyUserInputEnvelopeObjectSchema: z.ZodType<Prisma.ChartCreateManyUserInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.ChartCreateManyUserInputEnvelope>;
export const ChartCreateManyUserInputEnvelopeObjectZodSchema = makeSchema();
