import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DataSourceCreateWithoutSourceLinkInputObjectSchema as DataSourceCreateWithoutSourceLinkInputObjectSchema } from './DataSourceCreateWithoutSourceLinkInput.schema';
import { DataSourceUncheckedCreateWithoutSourceLinkInputObjectSchema as DataSourceUncheckedCreateWithoutSourceLinkInputObjectSchema } from './DataSourceUncheckedCreateWithoutSourceLinkInput.schema';
import { DataSourceCreateOrConnectWithoutSourceLinkInputObjectSchema as DataSourceCreateOrConnectWithoutSourceLinkInputObjectSchema } from './DataSourceCreateOrConnectWithoutSourceLinkInput.schema';
import { DataSourceUpsertWithoutSourceLinkInputObjectSchema as DataSourceUpsertWithoutSourceLinkInputObjectSchema } from './DataSourceUpsertWithoutSourceLinkInput.schema';
import { DataSourceWhereUniqueInputObjectSchema as DataSourceWhereUniqueInputObjectSchema } from './DataSourceWhereUniqueInput.schema';
import { DataSourceUpdateToOneWithWhereWithoutSourceLinkInputObjectSchema as DataSourceUpdateToOneWithWhereWithoutSourceLinkInputObjectSchema } from './DataSourceUpdateToOneWithWhereWithoutSourceLinkInput.schema';
import { DataSourceUpdateWithoutSourceLinkInputObjectSchema as DataSourceUpdateWithoutSourceLinkInputObjectSchema } from './DataSourceUpdateWithoutSourceLinkInput.schema';
import { DataSourceUncheckedUpdateWithoutSourceLinkInputObjectSchema as DataSourceUncheckedUpdateWithoutSourceLinkInputObjectSchema } from './DataSourceUncheckedUpdateWithoutSourceLinkInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => DataSourceCreateWithoutSourceLinkInputObjectSchema), z.lazy(() => DataSourceUncheckedCreateWithoutSourceLinkInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => DataSourceCreateOrConnectWithoutSourceLinkInputObjectSchema).optional(),
  upsert: z.lazy(() => DataSourceUpsertWithoutSourceLinkInputObjectSchema).optional(),
  connect: z.lazy(() => DataSourceWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => DataSourceUpdateToOneWithWhereWithoutSourceLinkInputObjectSchema), z.lazy(() => DataSourceUpdateWithoutSourceLinkInputObjectSchema), z.lazy(() => DataSourceUncheckedUpdateWithoutSourceLinkInputObjectSchema)]).optional()
}).strict();
export const DataSourceUpdateOneRequiredWithoutSourceLinkNestedInputObjectSchema: z.ZodType<Prisma.DataSourceUpdateOneRequiredWithoutSourceLinkNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.DataSourceUpdateOneRequiredWithoutSourceLinkNestedInput>;
export const DataSourceUpdateOneRequiredWithoutSourceLinkNestedInputObjectZodSchema = makeSchema();
