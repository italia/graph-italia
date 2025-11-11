import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { DataSourceUpdateOneRequiredWithoutSourceLinkNestedInputObjectSchema as DataSourceUpdateOneRequiredWithoutSourceLinkNestedInputObjectSchema } from './DataSourceUpdateOneRequiredWithoutSourceLinkNestedInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  config: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  dataSource: z.lazy(() => DataSourceUpdateOneRequiredWithoutSourceLinkNestedInputObjectSchema).optional()
}).strict();
export const SourceLinkUpdateWithoutChartInputObjectSchema: z.ZodType<Prisma.SourceLinkUpdateWithoutChartInput> = makeSchema() as unknown as z.ZodType<Prisma.SourceLinkUpdateWithoutChartInput>;
export const SourceLinkUpdateWithoutChartInputObjectZodSchema = makeSchema();
