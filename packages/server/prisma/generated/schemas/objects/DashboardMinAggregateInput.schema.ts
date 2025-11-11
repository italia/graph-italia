import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  description: z.literal(true).optional(),
  publish: z.literal(true).optional(),
  userId: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const DashboardMinAggregateInputObjectSchema: z.ZodType<Prisma.DashboardMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.DashboardMinAggregateInputType>;
export const DashboardMinAggregateInputObjectZodSchema = makeSchema();
