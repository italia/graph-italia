import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { DataSourceSelectObjectSchema as DataSourceSelectObjectSchema } from './objects/DataSourceSelect.schema';
import { DataSourceIncludeObjectSchema as DataSourceIncludeObjectSchema } from './objects/DataSourceInclude.schema';
import { DataSourceCreateInputObjectSchema as DataSourceCreateInputObjectSchema } from './objects/DataSourceCreateInput.schema';
import { DataSourceUncheckedCreateInputObjectSchema as DataSourceUncheckedCreateInputObjectSchema } from './objects/DataSourceUncheckedCreateInput.schema';

export const DataSourceCreateOneSchema: z.ZodType<Prisma.DataSourceCreateArgs> = z.object({ select: DataSourceSelectObjectSchema.optional(), include: DataSourceIncludeObjectSchema.optional(), data: z.union([DataSourceCreateInputObjectSchema, DataSourceUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.DataSourceCreateArgs>;

export const DataSourceCreateOneZodSchema = z.object({ select: DataSourceSelectObjectSchema.optional(), include: DataSourceIncludeObjectSchema.optional(), data: z.union([DataSourceCreateInputObjectSchema, DataSourceUncheckedCreateInputObjectSchema]) }).strict();