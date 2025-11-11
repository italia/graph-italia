import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema as BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { UserUpdateOneRequiredWithoutDashboardNestedInputObjectSchema as UserUpdateOneRequiredWithoutDashboardNestedInputObjectSchema } from './UserUpdateOneRequiredWithoutDashboardNestedInput.schema';
import { SlotUpdateManyWithoutDashboardNestedInputObjectSchema as SlotUpdateManyWithoutDashboardNestedInputObjectSchema } from './SlotUpdateManyWithoutDashboardNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  publish: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutDashboardNestedInputObjectSchema).optional(),
  slots: z.lazy(() => SlotUpdateManyWithoutDashboardNestedInputObjectSchema).optional()
}).strict();
export const DashboardUpdateInputObjectSchema: z.ZodType<Prisma.DashboardUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.DashboardUpdateInput>;
export const DashboardUpdateInputObjectZodSchema = makeSchema();
