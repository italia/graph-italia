import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DataSourceWhereInputObjectSchema as DataSourceWhereInputObjectSchema } from './DataSourceWhereInput.schema';
import { DataSourceUpdateWithoutSourceLinkInputObjectSchema as DataSourceUpdateWithoutSourceLinkInputObjectSchema } from './DataSourceUpdateWithoutSourceLinkInput.schema';
import { DataSourceUncheckedUpdateWithoutSourceLinkInputObjectSchema as DataSourceUncheckedUpdateWithoutSourceLinkInputObjectSchema } from './DataSourceUncheckedUpdateWithoutSourceLinkInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => DataSourceWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => DataSourceUpdateWithoutSourceLinkInputObjectSchema), z.lazy(() => DataSourceUncheckedUpdateWithoutSourceLinkInputObjectSchema)])
}).strict();
export const DataSourceUpdateToOneWithWhereWithoutSourceLinkInputObjectSchema: z.ZodType<Prisma.DataSourceUpdateToOneWithWhereWithoutSourceLinkInput> = makeSchema() as unknown as z.ZodType<Prisma.DataSourceUpdateToOneWithWhereWithoutSourceLinkInput>;
export const DataSourceUpdateToOneWithWhereWithoutSourceLinkInputObjectZodSchema = makeSchema();
