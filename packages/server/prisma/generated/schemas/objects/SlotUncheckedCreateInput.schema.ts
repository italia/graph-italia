import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  dashboardId: z.string(),
  chartId: z.string(),
  settings: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  name: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();
export const SlotUncheckedCreateInputObjectSchema: z.ZodType<Prisma.SlotUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.SlotUncheckedCreateInput>;
export const SlotUncheckedCreateInputObjectZodSchema = makeSchema();
