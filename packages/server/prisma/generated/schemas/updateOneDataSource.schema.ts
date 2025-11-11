import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { DataSourceSelectObjectSchema as DataSourceSelectObjectSchema } from './objects/DataSourceSelect.schema';
import { DataSourceIncludeObjectSchema as DataSourceIncludeObjectSchema } from './objects/DataSourceInclude.schema';
import { DataSourceUpdateInputObjectSchema as DataSourceUpdateInputObjectSchema } from './objects/DataSourceUpdateInput.schema';
import { DataSourceUncheckedUpdateInputObjectSchema as DataSourceUncheckedUpdateInputObjectSchema } from './objects/DataSourceUncheckedUpdateInput.schema';
import { DataSourceWhereUniqueInputObjectSchema as DataSourceWhereUniqueInputObjectSchema } from './objects/DataSourceWhereUniqueInput.schema';

export const DataSourceUpdateOneSchema: z.ZodType<Prisma.DataSourceUpdateArgs> = z.object({ select: DataSourceSelectObjectSchema.optional(), include: DataSourceIncludeObjectSchema.optional(), data: z.union([DataSourceUpdateInputObjectSchema, DataSourceUncheckedUpdateInputObjectSchema]), where: DataSourceWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.DataSourceUpdateArgs>;

export const DataSourceUpdateOneZodSchema = z.object({ select: DataSourceSelectObjectSchema.optional(), include: DataSourceIncludeObjectSchema.optional(), data: z.union([DataSourceUpdateInputObjectSchema, DataSourceUncheckedUpdateInputObjectSchema]), where: DataSourceWhereUniqueInputObjectSchema }).strict();