import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SourceLinkCreateManyDataSourceInputObjectSchema as SourceLinkCreateManyDataSourceInputObjectSchema } from './SourceLinkCreateManyDataSourceInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => SourceLinkCreateManyDataSourceInputObjectSchema), z.lazy(() => SourceLinkCreateManyDataSourceInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const SourceLinkCreateManyDataSourceInputEnvelopeObjectSchema: z.ZodType<Prisma.SourceLinkCreateManyDataSourceInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.SourceLinkCreateManyDataSourceInputEnvelope>;
export const SourceLinkCreateManyDataSourceInputEnvelopeObjectZodSchema = makeSchema();
