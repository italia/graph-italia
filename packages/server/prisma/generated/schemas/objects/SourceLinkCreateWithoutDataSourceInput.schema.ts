import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { ChartCreateNestedOneWithoutSourceLinkInputObjectSchema as ChartCreateNestedOneWithoutSourceLinkInputObjectSchema } from './ChartCreateNestedOneWithoutSourceLinkInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  config: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  chart: z.lazy(() => ChartCreateNestedOneWithoutSourceLinkInputObjectSchema)
}).strict();
export const SourceLinkCreateWithoutDataSourceInputObjectSchema: z.ZodType<Prisma.SourceLinkCreateWithoutDataSourceInput> = makeSchema() as unknown as z.ZodType<Prisma.SourceLinkCreateWithoutDataSourceInput>;
export const SourceLinkCreateWithoutDataSourceInputObjectZodSchema = makeSchema();
