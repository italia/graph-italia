import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  slot: z.boolean().optional(),
  SourceLink: z.boolean().optional()
}).strict();
export const ChartCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.ChartCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.ChartCountOutputTypeSelect>;
export const ChartCountOutputTypeSelectObjectZodSchema = makeSchema();
