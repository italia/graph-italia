import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { DataSourceSelectObjectSchema as DataSourceSelectObjectSchema } from './objects/DataSourceSelect.schema';
import { DataSourceUpdateManyMutationInputObjectSchema as DataSourceUpdateManyMutationInputObjectSchema } from './objects/DataSourceUpdateManyMutationInput.schema';
import { DataSourceWhereInputObjectSchema as DataSourceWhereInputObjectSchema } from './objects/DataSourceWhereInput.schema';

export const DataSourceUpdateManyAndReturnSchema: z.ZodType<Prisma.DataSourceUpdateManyAndReturnArgs> = z.object({ select: DataSourceSelectObjectSchema.optional(), data: DataSourceUpdateManyMutationInputObjectSchema, where: DataSourceWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.DataSourceUpdateManyAndReturnArgs>;

export const DataSourceUpdateManyAndReturnZodSchema = z.object({ select: DataSourceSelectObjectSchema.optional(), data: DataSourceUpdateManyMutationInputObjectSchema, where: DataSourceWhereInputObjectSchema.optional() }).strict();