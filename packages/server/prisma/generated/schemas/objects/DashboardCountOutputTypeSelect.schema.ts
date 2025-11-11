import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  slots: z.boolean().optional()
}).strict();
export const DashboardCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.DashboardCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.DashboardCountOutputTypeSelect>;
export const DashboardCountOutputTypeSelectObjectZodSchema = makeSchema();
