import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DataSourceWhereUniqueInputObjectSchema as DataSourceWhereUniqueInputObjectSchema } from './DataSourceWhereUniqueInput.schema';
import { DataSourceCreateWithoutUserInputObjectSchema as DataSourceCreateWithoutUserInputObjectSchema } from './DataSourceCreateWithoutUserInput.schema';
import { DataSourceUncheckedCreateWithoutUserInputObjectSchema as DataSourceUncheckedCreateWithoutUserInputObjectSchema } from './DataSourceUncheckedCreateWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => DataSourceWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => DataSourceCreateWithoutUserInputObjectSchema), z.lazy(() => DataSourceUncheckedCreateWithoutUserInputObjectSchema)])
}).strict();
export const DataSourceCreateOrConnectWithoutUserInputObjectSchema: z.ZodType<Prisma.DataSourceCreateOrConnectWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.DataSourceCreateOrConnectWithoutUserInput>;
export const DataSourceCreateOrConnectWithoutUserInputObjectZodSchema = makeSchema();
