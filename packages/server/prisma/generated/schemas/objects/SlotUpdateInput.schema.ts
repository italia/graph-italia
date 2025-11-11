import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { DashboardUpdateOneRequiredWithoutSlotsNestedInputObjectSchema as DashboardUpdateOneRequiredWithoutSlotsNestedInputObjectSchema } from './DashboardUpdateOneRequiredWithoutSlotsNestedInput.schema';
import { ChartUpdateOneRequiredWithoutSlotNestedInputObjectSchema as ChartUpdateOneRequiredWithoutSlotNestedInputObjectSchema } from './ChartUpdateOneRequiredWithoutSlotNestedInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  settings: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  name: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  dashboard: z.lazy(() => DashboardUpdateOneRequiredWithoutSlotsNestedInputObjectSchema).optional(),
  chart: z.lazy(() => ChartUpdateOneRequiredWithoutSlotNestedInputObjectSchema).optional()
}).strict();
export const SlotUpdateInputObjectSchema: z.ZodType<Prisma.SlotUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.SlotUpdateInput>;
export const SlotUpdateInputObjectZodSchema = makeSchema();
