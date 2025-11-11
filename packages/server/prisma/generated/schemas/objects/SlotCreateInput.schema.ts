import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { DashboardCreateNestedOneWithoutSlotsInputObjectSchema as DashboardCreateNestedOneWithoutSlotsInputObjectSchema } from './DashboardCreateNestedOneWithoutSlotsInput.schema';
import { ChartCreateNestedOneWithoutSlotInputObjectSchema as ChartCreateNestedOneWithoutSlotInputObjectSchema } from './ChartCreateNestedOneWithoutSlotInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  settings: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  name: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  dashboard: z.lazy(() => DashboardCreateNestedOneWithoutSlotsInputObjectSchema),
  chart: z.lazy(() => ChartCreateNestedOneWithoutSlotInputObjectSchema)
}).strict();
export const SlotCreateInputObjectSchema: z.ZodType<Prisma.SlotCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.SlotCreateInput>;
export const SlotCreateInputObjectZodSchema = makeSchema();
