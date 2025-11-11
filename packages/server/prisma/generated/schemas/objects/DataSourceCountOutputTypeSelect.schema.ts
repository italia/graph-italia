import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  SourceLink: z.boolean().optional()
}).strict();
export const DataSourceCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.DataSourceCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.DataSourceCountOutputTypeSelect>;
export const DataSourceCountOutputTypeSelectObjectZodSchema = makeSchema();
