import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  dashboardId: z.literal(true).optional(),
  chartId: z.literal(true).optional(),
  name: z.literal(true).optional(),
  description: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const SlotMaxAggregateInputObjectSchema: z.ZodType<Prisma.SlotMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.SlotMaxAggregateInputType>;
export const SlotMaxAggregateInputObjectZodSchema = makeSchema();
