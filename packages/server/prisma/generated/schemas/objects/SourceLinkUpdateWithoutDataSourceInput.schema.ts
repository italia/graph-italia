import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { ChartUpdateOneRequiredWithoutSourceLinkNestedInputObjectSchema as ChartUpdateOneRequiredWithoutSourceLinkNestedInputObjectSchema } from './ChartUpdateOneRequiredWithoutSourceLinkNestedInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  config: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  chart: z.lazy(() => ChartUpdateOneRequiredWithoutSourceLinkNestedInputObjectSchema).optional()
}).strict();
export const SourceLinkUpdateWithoutDataSourceInputObjectSchema: z.ZodType<Prisma.SourceLinkUpdateWithoutDataSourceInput> = makeSchema() as unknown as z.ZodType<Prisma.SourceLinkUpdateWithoutDataSourceInput>;
export const SourceLinkUpdateWithoutDataSourceInputObjectZodSchema = makeSchema();
