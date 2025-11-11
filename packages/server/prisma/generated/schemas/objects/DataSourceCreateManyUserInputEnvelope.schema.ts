import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DataSourceCreateManyUserInputObjectSchema as DataSourceCreateManyUserInputObjectSchema } from './DataSourceCreateManyUserInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => DataSourceCreateManyUserInputObjectSchema), z.lazy(() => DataSourceCreateManyUserInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const DataSourceCreateManyUserInputEnvelopeObjectSchema: z.ZodType<Prisma.DataSourceCreateManyUserInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.DataSourceCreateManyUserInputEnvelope>;
export const DataSourceCreateManyUserInputEnvelopeObjectZodSchema = makeSchema();
