import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { ChartCreateNestedOneWithoutSlotInputObjectSchema as ChartCreateNestedOneWithoutSlotInputObjectSchema } from './ChartCreateNestedOneWithoutSlotInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  settings: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  name: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  chart: z.lazy(() => ChartCreateNestedOneWithoutSlotInputObjectSchema)
}).strict();
export const SlotCreateWithoutDashboardInputObjectSchema: z.ZodType<Prisma.SlotCreateWithoutDashboardInput> = makeSchema() as unknown as z.ZodType<Prisma.SlotCreateWithoutDashboardInput>;
export const SlotCreateWithoutDashboardInputObjectZodSchema = makeSchema();
