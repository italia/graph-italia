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
export const SourceLinkCreateManyChartInputObjectSchema: z.ZodType<Prisma.SourceLinkCreateManyChartInput> = makeSchema() as unknown as z.ZodType<Prisma.SourceLinkCreateManyChartInput>;
export const SourceLinkCreateManyChartInputObjectZodSchema = makeSchema();
