import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DataSourceUpdateWithoutSourceLinkInputObjectSchema as DataSourceUpdateWithoutSourceLinkInputObjectSchema } from './DataSourceUpdateWithoutSourceLinkInput.schema';
import { DataSourceUncheckedUpdateWithoutSourceLinkInputObjectSchema as DataSourceUncheckedUpdateWithoutSourceLinkInputObjectSchema } from './DataSourceUncheckedUpdateWithoutSourceLinkInput.schema';
import { DataSourceCreateWithoutSourceLinkInputObjectSchema as DataSourceCreateWithoutSourceLinkInputObjectSchema } from './DataSourceCreateWithoutSourceLinkInput.schema';
import { DataSourceUncheckedCreateWithoutSourceLinkInputObjectSchema as DataSourceUncheckedCreateWithoutSourceLinkInputObjectSchema } from './DataSourceUncheckedCreateWithoutSourceLinkInput.schema';
import { DataSourceWhereInputObjectSchema as DataSourceWhereInputObjectSchema } from './DataSourceWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => DataSourceUpdateWithoutSourceLinkInputObjectSchema), z.lazy(() => DataSourceUncheckedUpdateWithoutSourceLinkInputObjectSchema)]),
  create: z.union([z.lazy(() => DataSourceCreateWithoutSourceLinkInputObjectSchema), z.lazy(() => DataSourceUncheckedCreateWithoutSourceLinkInputObjectSchema)]),
  where: z.lazy(() => DataSourceWhereInputObjectSchema).optional()
}).strict();
export const DataSourceUpsertWithoutSourceLinkInputObjectSchema: z.ZodType<Prisma.DataSourceUpsertWithoutSourceLinkInput> = makeSchema() as unknown as z.ZodType<Prisma.DataSourceUpsertWithoutSourceLinkInput>;
export const DataSourceUpsertWithoutSourceLinkInputObjectZodSchema = makeSchema();
