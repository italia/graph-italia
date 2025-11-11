import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema as BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { SlotUncheckedUpdateManyWithoutDashboardNestedInputObjectSchema as SlotUncheckedUpdateManyWithoutDashboardNestedInputObjectSchema } from './SlotUncheckedUpdateManyWithoutDashboardNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  publish: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  slots: z.lazy(() => SlotUncheckedUpdateManyWithoutDashboardNestedInputObjectSchema).optional()
}).strict();
export const DashboardUncheckedUpdateWithoutUserInputObjectSchema: z.ZodType<Prisma.DashboardUncheckedUpdateWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.DashboardUncheckedUpdateWithoutUserInput>;
export const DashboardUncheckedUpdateWithoutUserInputObjectZodSchema = makeSchema();
