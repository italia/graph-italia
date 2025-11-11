import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { JsonNullValueInputSchema } from '../enums/JsonNullValueInput.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema as BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { UserUpdateOneRequiredWithoutDataSourceNestedInputObjectSchema as UserUpdateOneRequiredWithoutDataSourceNestedInputObjectSchema } from './UserUpdateOneRequiredWithoutDataSourceNestedInput.schema';
import { SourceLinkUpdateManyWithoutDataSourceNestedInputObjectSchema as SourceLinkUpdateManyWithoutDataSourceNestedInputObjectSchema } from './SourceLinkUpdateManyWithoutDataSourceNestedInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  data: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  rules: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  publish: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  isTrasposed: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  remoteUrl: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  isRemote: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutDataSourceNestedInputObjectSchema).optional(),
  SourceLink: z.lazy(() => SourceLinkUpdateManyWithoutDataSourceNestedInputObjectSchema).optional()
}).strict();
export const DataSourceUpdateInputObjectSchema: z.ZodType<Prisma.DataSourceUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.DataSourceUpdateInput>;
export const DataSourceUpdateInputObjectZodSchema = makeSchema();
