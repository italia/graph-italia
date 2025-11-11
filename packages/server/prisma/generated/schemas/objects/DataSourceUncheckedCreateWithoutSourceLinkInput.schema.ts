import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { JsonNullValueInputSchema } from '../enums/JsonNullValueInput.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  data: z.union([JsonNullValueInputSchema, jsonSchema]),
  rules: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  publish: z.boolean().optional(),
  isTrasposed: z.boolean().optional(),
  remoteUrl: z.string().optional().nullable(),
  isRemote: z.boolean().optional(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const DataSourceUncheckedCreateWithoutSourceLinkInputObjectSchema: z.ZodType<Prisma.DataSourceUncheckedCreateWithoutSourceLinkInput> = makeSchema() as unknown as z.ZodType<Prisma.DataSourceUncheckedCreateWithoutSourceLinkInput>;
export const DataSourceUncheckedCreateWithoutSourceLinkInputObjectZodSchema = makeSchema();
