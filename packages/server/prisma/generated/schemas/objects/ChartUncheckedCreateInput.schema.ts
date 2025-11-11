import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { SlotUncheckedCreateNestedManyWithoutChartInputObjectSchema as SlotUncheckedCreateNestedManyWithoutChartInputObjectSchema } from './SlotUncheckedCreateNestedManyWithoutChartInput.schema';
import { SourceLinkUncheckedCreateNestedManyWithoutChartInputObjectSchema as SourceLinkUncheckedCreateNestedManyWithoutChartInputObjectSchema } from './SourceLinkUncheckedCreateNestedManyWithoutChartInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  chart: z.string(),
  config: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  data: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  publish: z.boolean().optional(),
  remoteUrl: z.string().optional().nullable(),
  isRemote: z.boolean().optional(),
  preview: z.string().optional().nullable(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  slot: z.lazy(() => SlotUncheckedCreateNestedManyWithoutChartInputObjectSchema),
  SourceLink: z.lazy(() => SourceLinkUncheckedCreateNestedManyWithoutChartInputObjectSchema)
}).strict();
export const ChartUncheckedCreateInputObjectSchema: z.ZodType<Prisma.ChartUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.ChartUncheckedCreateInput>;
export const ChartUncheckedCreateInputObjectZodSchema = makeSchema();
