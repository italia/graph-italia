import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { DataSourceUpdateManyMutationInputObjectSchema as DataSourceUpdateManyMutationInputObjectSchema } from './objects/DataSourceUpdateManyMutationInput.schema';
import { DataSourceWhereInputObjectSchema as DataSourceWhereInputObjectSchema } from './objects/DataSourceWhereInput.schema';

export const DataSourceUpdateManySchema: z.ZodType<Prisma.DataSourceUpdateManyArgs> = z.object({ data: DataSourceUpdateManyMutationInputObjectSchema, where: DataSourceWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.DataSourceUpdateManyArgs>;

export const DataSourceUpdateManyZodSchema = z.object({ data: DataSourceUpdateManyMutationInputObjectSchema, where: DataSourceWhereInputObjectSchema.optional() }).strict();