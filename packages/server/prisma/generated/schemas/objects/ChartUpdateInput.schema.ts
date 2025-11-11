import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema as BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { UserUpdateOneRequiredWithoutChartNestedInputObjectSchema as UserUpdateOneRequiredWithoutChartNestedInputObjectSchema } from './UserUpdateOneRequiredWithoutChartNestedInput.schema';
import { SlotUpdateManyWithoutChartNestedInputObjectSchema as SlotUpdateManyWithoutChartNestedInputObjectSchema } from './SlotUpdateManyWithoutChartNestedInput.schema';
import { SourceLinkUpdateManyWithoutChartNestedInputObjectSchema as SourceLinkUpdateManyWithoutChartNestedInputObjectSchema } from './SourceLinkUpdateManyWithoutChartNestedInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  chart: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  config: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  data: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  publish: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  remoteUrl: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  isRemote: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  preview: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutChartNestedInputObjectSchema).optional(),
  slot: z.lazy(() => SlotUpdateManyWithoutChartNestedInputObjectSchema).optional(),
  SourceLink: z.lazy(() => SourceLinkUpdateManyWithoutChartNestedInputObjectSchema).optional()
}).strict();
export const ChartUpdateInputObjectSchema: z.ZodType<Prisma.ChartUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.ChartUpdateInput>;
export const ChartUpdateInputObjectZodSchema = makeSchema();
