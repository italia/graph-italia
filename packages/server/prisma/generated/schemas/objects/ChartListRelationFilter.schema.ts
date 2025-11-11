import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ChartWhereInputObjectSchema as ChartWhereInputObjectSchema } from './ChartWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => ChartWhereInputObjectSchema).optional(),
  some: z.lazy(() => ChartWhereInputObjectSchema).optional(),
  none: z.lazy(() => ChartWhereInputObjectSchema).optional()
}).strict();
export const ChartListRelationFilterObjectSchema: z.ZodType<Prisma.ChartListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.ChartListRelationFilter>;
export const ChartListRelationFilterObjectZodSchema = makeSchema();
