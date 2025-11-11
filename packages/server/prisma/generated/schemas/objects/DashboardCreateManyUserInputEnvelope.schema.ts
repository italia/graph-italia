import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DashboardCreateManyUserInputObjectSchema as DashboardCreateManyUserInputObjectSchema } from './DashboardCreateManyUserInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => DashboardCreateManyUserInputObjectSchema), z.lazy(() => DashboardCreateManyUserInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const DashboardCreateManyUserInputEnvelopeObjectSchema: z.ZodType<Prisma.DashboardCreateManyUserInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.DashboardCreateManyUserInputEnvelope>;
export const DashboardCreateManyUserInputEnvelopeObjectZodSchema = makeSchema();
