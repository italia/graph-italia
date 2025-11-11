import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { DataSourceSelectObjectSchema as DataSourceSelectObjectSchema } from './objects/DataSourceSelect.schema';
import { DataSourceIncludeObjectSchema as DataSourceIncludeObjectSchema } from './objects/DataSourceInclude.schema';
import { DataSourceWhereUniqueInputObjectSchema as DataSourceWhereUniqueInputObjectSchema } from './objects/DataSourceWhereUniqueInput.schema';

export const DataSourceDeleteOneSchema: z.ZodType<Prisma.DataSourceDeleteArgs> = z.object({ select: DataSourceSelectObjectSchema.optional(), include: DataSourceIncludeObjectSchema.optional(), where: DataSourceWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.DataSourceDeleteArgs>;

export const DataSourceDeleteOneZodSchema = z.object({ select: DataSourceSelectObjectSchema.optional(), include: DataSourceIncludeObjectSchema.optional(), where: DataSourceWhereUniqueInputObjectSchema }).strict();