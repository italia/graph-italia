import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SourceLinkCreateManyChartInputObjectSchema as SourceLinkCreateManyChartInputObjectSchema } from './SourceLinkCreateManyChartInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => SourceLinkCreateManyChartInputObjectSchema), z.lazy(() => SourceLinkCreateManyChartInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const SourceLinkCreateManyChartInputEnvelopeObjectSchema: z.ZodType<Prisma.SourceLinkCreateManyChartInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.SourceLinkCreateManyChartInputEnvelope>;
export const SourceLinkCreateManyChartInputEnvelopeObjectZodSchema = makeSchema();
