import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { DataSourceWhereInputObjectSchema as DataSourceWhereInputObjectSchema } from './objects/DataSourceWhereInput.schema';

export const DataSourceDeleteManySchema: z.ZodType<Prisma.DataSourceDeleteManyArgs> = z.object({ where: DataSourceWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.DataSourceDeleteManyArgs>;

export const DataSourceDeleteManyZodSchema = z.object({ where: DataSourceWhereInputObjectSchema.optional() }).strict();