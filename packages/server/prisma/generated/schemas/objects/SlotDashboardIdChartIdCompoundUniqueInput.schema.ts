import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  dashboardId: z.string(),
  chartId: z.string()
}).strict();
export const SlotDashboardIdChartIdCompoundUniqueInputObjectSchema: z.ZodType<Prisma.SlotDashboardIdChartIdCompoundUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.SlotDashboardIdChartIdCompoundUniqueInput>;
export const SlotDashboardIdChartIdCompoundUniqueInputObjectZodSchema = makeSchema();
