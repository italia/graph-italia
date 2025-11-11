import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { DashboardUpdateOneRequiredWithoutSlotsNestedInputObjectSchema as DashboardUpdateOneRequiredWithoutSlotsNestedInputObjectSchema } from './DashboardUpdateOneRequiredWithoutSlotsNestedInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  settings: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  name: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  dashboard: z.lazy(() => DashboardUpdateOneRequiredWithoutSlotsNestedInputObjectSchema).optional()
}).strict();
export const SlotUpdateWithoutChartInputObjectSchema: z.ZodType<Prisma.SlotUpdateWithoutChartInput> = makeSchema() as unknown as z.ZodType<Prisma.SlotUpdateWithoutChartInput>;
export const SlotUpdateWithoutChartInputObjectZodSchema = makeSchema();
