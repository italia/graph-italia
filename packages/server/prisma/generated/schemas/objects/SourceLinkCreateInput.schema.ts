import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { DataSourceCreateNestedOneWithoutSourceLinkInputObjectSchema as DataSourceCreateNestedOneWithoutSourceLinkInputObjectSchema } from './DataSourceCreateNestedOneWithoutSourceLinkInput.schema';
import { ChartCreateNestedOneWithoutSourceLinkInputObjectSchema as ChartCreateNestedOneWithoutSourceLinkInputObjectSchema } from './ChartCreateNestedOneWithoutSourceLinkInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  config: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.coerce.date().optional(),
  dataSource: z.lazy(() => DataSourceCreateNestedOneWithoutSourceLinkInputObjectSchema),
  chart: z.lazy(() => ChartCreateNestedOneWithoutSourceLinkInputObjectSchema)
}).strict();
export const SourceLinkCreateInputObjectSchema: z.ZodType<Prisma.SourceLinkCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.SourceLinkCreateInput>;
export const SourceLinkCreateInputObjectZodSchema = makeSchema();
