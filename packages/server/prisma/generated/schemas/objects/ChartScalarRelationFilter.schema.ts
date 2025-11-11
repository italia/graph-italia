import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ChartWhereInputObjectSchema as ChartWhereInputObjectSchema } from './ChartWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => ChartWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => ChartWhereInputObjectSchema).optional()
}).strict();
export const ChartScalarRelationFilterObjectSchema: z.ZodType<Prisma.ChartScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.ChartScalarRelationFilter>;
export const ChartScalarRelationFilterObjectZodSchema = makeSchema();
