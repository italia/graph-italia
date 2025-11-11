import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DataSourceWhereUniqueInputObjectSchema as DataSourceWhereUniqueInputObjectSchema } from './DataSourceWhereUniqueInput.schema';
import { DataSourceCreateWithoutSourceLinkInputObjectSchema as DataSourceCreateWithoutSourceLinkInputObjectSchema } from './DataSourceCreateWithoutSourceLinkInput.schema';
import { DataSourceUncheckedCreateWithoutSourceLinkInputObjectSchema as DataSourceUncheckedCreateWithoutSourceLinkInputObjectSchema } from './DataSourceUncheckedCreateWithoutSourceLinkInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => DataSourceWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => DataSourceCreateWithoutSourceLinkInputObjectSchema), z.lazy(() => DataSourceUncheckedCreateWithoutSourceLinkInputObjectSchema)])
}).strict();
export const DataSourceCreateOrConnectWithoutSourceLinkInputObjectSchema: z.ZodType<Prisma.DataSourceCreateOrConnectWithoutSourceLinkInput> = makeSchema() as unknown as z.ZodType<Prisma.DataSourceCreateOrConnectWithoutSourceLinkInput>;
export const DataSourceCreateOrConnectWithoutSourceLinkInputObjectZodSchema = makeSchema();
