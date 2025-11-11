import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { DataSourceUpdateOneRequiredWithoutSourceLinkNestedInputObjectSchema as DataSourceUpdateOneRequiredWithoutSourceLinkNestedInputObjectSchema } from './DataSourceUpdateOneRequiredWithoutSourceLinkNestedInput.schema';
import { ChartUpdateOneRequiredWithoutSourceLinkNestedInputObjectSchema as ChartUpdateOneRequiredWithoutSourceLinkNestedInputObjectSchema } from './ChartUpdateOneRequiredWithoutSourceLinkNestedInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  config: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  dataSource: z.lazy(() => DataSourceUpdateOneRequiredWithoutSourceLinkNestedInputObjectSchema).optional(),
  chart: z.lazy(() => ChartUpdateOneRequiredWithoutSourceLinkNestedInputObjectSchema).optional()
}).strict();
export const SourceLinkUpdateInputObjectSchema: z.ZodType<Prisma.SourceLinkUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.SourceLinkUpdateInput>;
export const SourceLinkUpdateInputObjectZodSchema = makeSchema();
