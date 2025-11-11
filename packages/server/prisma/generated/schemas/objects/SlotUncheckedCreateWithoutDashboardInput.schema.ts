import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  chartId: z.string(),
  settings: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  name: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const SlotUncheckedCreateWithoutDashboardInputObjectSchema: z.ZodType<Prisma.SlotUncheckedCreateWithoutDashboardInput> = makeSchema() as unknown as z.ZodType<Prisma.SlotUncheckedCreateWithoutDashboardInput>;
export const SlotUncheckedCreateWithoutDashboardInputObjectZodSchema = makeSchema();
