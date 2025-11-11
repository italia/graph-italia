import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { DataSourceSelectObjectSchema as DataSourceSelectObjectSchema } from './objects/DataSourceSelect.schema';
import { DataSourceIncludeObjectSchema as DataSourceIncludeObjectSchema } from './objects/DataSourceInclude.schema';
import { DataSourceWhereUniqueInputObjectSchema as DataSourceWhereUniqueInputObjectSchema } from './objects/DataSourceWhereUniqueInput.schema';

export const DataSourceFindUniqueSchema: z.ZodType<Prisma.DataSourceFindUniqueArgs> = z.object({ select: DataSourceSelectObjectSchema.optional(), include: DataSourceIncludeObjectSchema.optional(), where: DataSourceWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.DataSourceFindUniqueArgs>;

export const DataSourceFindUniqueZodSchema = z.object({ select: DataSourceSelectObjectSchema.optional(), include: DataSourceIncludeObjectSchema.optional(), where: DataSourceWhereUniqueInputObjectSchema }).strict();