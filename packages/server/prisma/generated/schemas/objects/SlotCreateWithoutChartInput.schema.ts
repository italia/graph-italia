import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { DashboardCreateNestedOneWithoutSlotsInputObjectSchema as DashboardCreateNestedOneWithoutSlotsInputObjectSchema } from './DashboardCreateNestedOneWithoutSlotsInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  settings: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  name: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  dashboard: z.lazy(() => DashboardCreateNestedOneWithoutSlotsInputObjectSchema)
}).strict();
export const SlotCreateWithoutChartInputObjectSchema: z.ZodType<Prisma.SlotCreateWithoutChartInput> = makeSchema() as unknown as z.ZodType<Prisma.SlotCreateWithoutChartInput>;
export const SlotCreateWithoutChartInputObjectZodSchema = makeSchema();
