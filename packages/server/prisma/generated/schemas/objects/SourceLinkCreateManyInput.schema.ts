import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  dataSourceId: z.string(),
  chartId: z.string(),
  config: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const SourceLinkCreateManyInputObjectSchema: z.ZodType<Prisma.SourceLinkCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.SourceLinkCreateManyInput>;
export const SourceLinkCreateManyInputObjectZodSchema = makeSchema();
