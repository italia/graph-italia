import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { DataSourceCreateManyInputObjectSchema as DataSourceCreateManyInputObjectSchema } from './objects/DataSourceCreateManyInput.schema';

export const DataSourceCreateManySchema: z.ZodType<Prisma.DataSourceCreateManyArgs> = z.object({ data: z.union([ DataSourceCreateManyInputObjectSchema, z.array(DataSourceCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.DataSourceCreateManyArgs>;

export const DataSourceCreateManyZodSchema = z.object({ data: z.union([ DataSourceCreateManyInputObjectSchema, z.array(DataSourceCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();