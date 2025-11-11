import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema as BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { ChartUpdateManyWithoutUserNestedInputObjectSchema as ChartUpdateManyWithoutUserNestedInputObjectSchema } from './ChartUpdateManyWithoutUserNestedInput.schema';
import { DashboardUpdateManyWithoutUserNestedInputObjectSchema as DashboardUpdateManyWithoutUserNestedInputObjectSchema } from './DashboardUpdateManyWithoutUserNestedInput.schema';
import { CodeUpdateManyWithoutUserNestedInputObjectSchema as CodeUpdateManyWithoutUserNestedInputObjectSchema } from './CodeUpdateManyWithoutUserNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  password: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  verifyed: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  Chart: z.lazy(() => ChartUpdateManyWithoutUserNestedInputObjectSchema).optional(),
  Dashboard: z.lazy(() => DashboardUpdateManyWithoutUserNestedInputObjectSchema).optional(),
  Code: z.lazy(() => CodeUpdateManyWithoutUserNestedInputObjectSchema).optional()
}).strict();
export const UserUpdateWithoutDataSourceInputObjectSchema: z.ZodType<Prisma.UserUpdateWithoutDataSourceInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateWithoutDataSourceInput>;
export const UserUpdateWithoutDataSourceInputObjectZodSchema = makeSchema();
