import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  dataSourceId: z.string(),
  config: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const SourceLinkUncheckedCreateWithoutChartInputObjectSchema: z.ZodType<Prisma.SourceLinkUncheckedCreateWithoutChartInput> = makeSchema() as unknown as z.ZodType<Prisma.SourceLinkUncheckedCreateWithoutChartInput>;
export const SourceLinkUncheckedCreateWithoutChartInputObjectZodSchema = makeSchema();
