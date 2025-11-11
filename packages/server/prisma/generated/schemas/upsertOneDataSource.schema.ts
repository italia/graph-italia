import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { DataSourceSelectObjectSchema as DataSourceSelectObjectSchema } from './objects/DataSourceSelect.schema';
import { DataSourceIncludeObjectSchema as DataSourceIncludeObjectSchema } from './objects/DataSourceInclude.schema';
import { DataSourceWhereUniqueInputObjectSchema as DataSourceWhereUniqueInputObjectSchema } from './objects/DataSourceWhereUniqueInput.schema';
import { DataSourceCreateInputObjectSchema as DataSourceCreateInputObjectSchema } from './objects/DataSourceCreateInput.schema';
import { DataSourceUncheckedCreateInputObjectSchema as DataSourceUncheckedCreateInputObjectSchema } from './objects/DataSourceUncheckedCreateInput.schema';
import { DataSourceUpdateInputObjectSchema as DataSourceUpdateInputObjectSchema } from './objects/DataSourceUpdateInput.schema';
import { DataSourceUncheckedUpdateInputObjectSchema as DataSourceUncheckedUpdateInputObjectSchema } from './objects/DataSourceUncheckedUpdateInput.schema';

export const DataSourceUpsertOneSchema: z.ZodType<Prisma.DataSourceUpsertArgs> = z.object({ select: DataSourceSelectObjectSchema.optional(), include: DataSourceIncludeObjectSchema.optional(), where: DataSourceWhereUniqueInputObjectSchema, create: z.union([ DataSourceCreateInputObjectSchema, DataSourceUncheckedCreateInputObjectSchema ]), update: z.union([ DataSourceUpdateInputObjectSchema, DataSourceUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.DataSourceUpsertArgs>;

export const DataSourceUpsertOneZodSchema = z.object({ select: DataSourceSelectObjectSchema.optional(), include: DataSourceIncludeObjectSchema.optional(), where: DataSourceWhereUniqueInputObjectSchema, create: z.union([ DataSourceCreateInputObjectSchema, DataSourceUncheckedCreateInputObjectSchema ]), update: z.union([ DataSourceUpdateInputObjectSchema, DataSourceUncheckedUpdateInputObjectSchema ]) }).strict();