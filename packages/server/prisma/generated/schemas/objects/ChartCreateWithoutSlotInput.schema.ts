import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { UserCreateNestedOneWithoutChartInputObjectSchema as UserCreateNestedOneWithoutChartInputObjectSchema } from './UserCreateNestedOneWithoutChartInput.schema';
import { SourceLinkCreateNestedManyWithoutChartInputObjectSchema as SourceLinkCreateNestedManyWithoutChartInputObjectSchema } from './SourceLinkCreateNestedManyWithoutChartInput.schema'

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
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutChartInputObjectSchema),
  SourceLink: z.lazy(() => SourceLinkCreateNestedManyWithoutChartInputObjectSchema).optional()
}).strict();
export const ChartCreateWithoutSlotInputObjectSchema: z.ZodType<Prisma.ChartCreateWithoutSlotInput> = makeSchema() as unknown as z.ZodType<Prisma.ChartCreateWithoutSlotInput>;
export const ChartCreateWithoutSlotInputObjectZodSchema = makeSchema();
