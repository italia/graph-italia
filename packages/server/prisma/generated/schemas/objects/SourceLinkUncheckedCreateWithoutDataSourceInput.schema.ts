import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  chartId: z.string(),
  config: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const SourceLinkUncheckedCreateWithoutDataSourceInputObjectSchema: z.ZodType<Prisma.SourceLinkUncheckedCreateWithoutDataSourceInput> = makeSchema() as unknown as z.ZodType<Prisma.SourceLinkUncheckedCreateWithoutDataSourceInput>;
export const SourceLinkUncheckedCreateWithoutDataSourceInputObjectZodSchema = makeSchema();
