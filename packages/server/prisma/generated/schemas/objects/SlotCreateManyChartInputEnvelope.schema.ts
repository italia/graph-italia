import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SlotCreateManyChartInputObjectSchema as SlotCreateManyChartInputObjectSchema } from './SlotCreateManyChartInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => SlotCreateManyChartInputObjectSchema), z.lazy(() => SlotCreateManyChartInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const SlotCreateManyChartInputEnvelopeObjectSchema: z.ZodType<Prisma.SlotCreateManyChartInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.SlotCreateManyChartInputEnvelope>;
export const SlotCreateManyChartInputEnvelopeObjectZodSchema = makeSchema();
