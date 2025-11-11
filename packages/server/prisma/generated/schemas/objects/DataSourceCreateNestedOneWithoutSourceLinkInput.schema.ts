import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DataSourceCreateWithoutSourceLinkInputObjectSchema as DataSourceCreateWithoutSourceLinkInputObjectSchema } from './DataSourceCreateWithoutSourceLinkInput.schema';
import { DataSourceUncheckedCreateWithoutSourceLinkInputObjectSchema as DataSourceUncheckedCreateWithoutSourceLinkInputObjectSchema } from './DataSourceUncheckedCreateWithoutSourceLinkInput.schema';
import { DataSourceCreateOrConnectWithoutSourceLinkInputObjectSchema as DataSourceCreateOrConnectWithoutSourceLinkInputObjectSchema } from './DataSourceCreateOrConnectWithoutSourceLinkInput.schema';
import { DataSourceWhereUniqueInputObjectSchema as DataSourceWhereUniqueInputObjectSchema } from './DataSourceWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => DataSourceCreateWithoutSourceLinkInputObjectSchema), z.lazy(() => DataSourceUncheckedCreateWithoutSourceLinkInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => DataSourceCreateOrConnectWithoutSourceLinkInputObjectSchema).optional(),
  connect: z.lazy(() => DataSourceWhereUniqueInputObjectSchema).optional()
}).strict();
export const DataSourceCreateNestedOneWithoutSourceLinkInputObjectSchema: z.ZodType<Prisma.DataSourceCreateNestedOneWithoutSourceLinkInput> = makeSchema() as unknown as z.ZodType<Prisma.DataSourceCreateNestedOneWithoutSourceLinkInput>;
export const DataSourceCreateNestedOneWithoutSourceLinkInputObjectZodSchema = makeSchema();
