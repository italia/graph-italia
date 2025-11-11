import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  dashboardId: z.literal(true).optional(),
  chartId: z.literal(true).optional(),
  settings: z.literal(true).optional(),
  name: z.literal(true).optional(),
  description: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const SlotCountAggregateInputObjectSchema: z.ZodType<Prisma.SlotCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.SlotCountAggregateInputType>;
export const SlotCountAggregateInputObjectZodSchema = makeSchema();
