import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { DataSourceCreateNestedOneWithoutSourceLinkInputObjectSchema as DataSourceCreateNestedOneWithoutSourceLinkInputObjectSchema } from './DataSourceCreateNestedOneWithoutSourceLinkInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  config: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  dataSource: z.lazy(() => DataSourceCreateNestedOneWithoutSourceLinkInputObjectSchema)
}).strict();
export const SourceLinkCreateWithoutChartInputObjectSchema: z.ZodType<Prisma.SourceLinkCreateWithoutChartInput> = makeSchema() as unknown as z.ZodType<Prisma.SourceLinkCreateWithoutChartInput>;
export const SourceLinkCreateWithoutChartInputObjectZodSchema = makeSchema();
