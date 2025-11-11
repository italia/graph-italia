import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema as BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { ChartUncheckedUpdateManyWithoutUserNestedInputObjectSchema as ChartUncheckedUpdateManyWithoutUserNestedInputObjectSchema } from './ChartUncheckedUpdateManyWithoutUserNestedInput.schema';
import { DashboardUncheckedUpdateManyWithoutUserNestedInputObjectSchema as DashboardUncheckedUpdateManyWithoutUserNestedInputObjectSchema } from './DashboardUncheckedUpdateManyWithoutUserNestedInput.schema';
import { CodeUncheckedUpdateManyWithoutUserNestedInputObjectSchema as CodeUncheckedUpdateManyWithoutUserNestedInputObjectSchema } from './CodeUncheckedUpdateManyWithoutUserNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  password: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  verifyed: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  Chart: z.lazy(() => ChartUncheckedUpdateManyWithoutUserNestedInputObjectSchema).optional(),
  Dashboard: z.lazy(() => DashboardUncheckedUpdateManyWithoutUserNestedInputObjectSchema).optional(),
  Code: z.lazy(() => CodeUncheckedUpdateManyWithoutUserNestedInputObjectSchema).optional()
}).strict();
export const UserUncheckedUpdateWithoutDataSourceInputObjectSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutDataSourceInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUncheckedUpdateWithoutDataSourceInput>;
export const UserUncheckedUpdateWithoutDataSourceInputObjectZodSchema = makeSchema();
