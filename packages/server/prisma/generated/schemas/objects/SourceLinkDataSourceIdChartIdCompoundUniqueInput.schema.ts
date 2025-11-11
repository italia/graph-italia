import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  dataSourceId: z.string(),
  chartId: z.string()
}).strict();
export const SourceLinkDataSourceIdChartIdCompoundUniqueInputObjectSchema: z.ZodType<Prisma.SourceLinkDataSourceIdChartIdCompoundUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.SourceLinkDataSourceIdChartIdCompoundUniqueInput>;
export const SourceLinkDataSourceIdChartIdCompoundUniqueInputObjectZodSchema = makeSchema();
