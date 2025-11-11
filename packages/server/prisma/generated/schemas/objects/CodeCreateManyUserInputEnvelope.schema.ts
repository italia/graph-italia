import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CodeCreateManyUserInputObjectSchema as CodeCreateManyUserInputObjectSchema } from './CodeCreateManyUserInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => CodeCreateManyUserInputObjectSchema), z.lazy(() => CodeCreateManyUserInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const CodeCreateManyUserInputEnvelopeObjectSchema: z.ZodType<Prisma.CodeCreateManyUserInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.CodeCreateManyUserInputEnvelope>;
export const CodeCreateManyUserInputEnvelopeObjectZodSchema = makeSchema();
