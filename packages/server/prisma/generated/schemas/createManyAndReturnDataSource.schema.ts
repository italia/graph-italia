import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { DataSourceSelectObjectSchema as DataSourceSelectObjectSchema } from './objects/DataSourceSelect.schema';
import { DataSourceCreateManyInputObjectSchema as DataSourceCreateManyInputObjectSchema } from './objects/DataSourceCreateManyInput.schema';

export const DataSourceCreateManyAndReturnSchema: z.ZodType<Prisma.DataSourceCreateManyAndReturnArgs> = z.object({ select: DataSourceSelectObjectSchema.optional(), data: z.union([ DataSourceCreateManyInputObjectSchema, z.array(DataSourceCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.DataSourceCreateManyAndReturnArgs>;

export const DataSourceCreateManyAndReturnZodSchema = z.object({ select: DataSourceSelectObjectSchema.optional(), data: z.union([ DataSourceCreateManyInputObjectSchema, z.array(DataSourceCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();