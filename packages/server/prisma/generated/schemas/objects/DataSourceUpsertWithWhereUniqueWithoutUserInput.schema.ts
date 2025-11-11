import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DataSourceWhereUniqueInputObjectSchema as DataSourceWhereUniqueInputObjectSchema } from './DataSourceWhereUniqueInput.schema';
import { DataSourceUpdateWithoutUserInputObjectSchema as DataSourceUpdateWithoutUserInputObjectSchema } from './DataSourceUpdateWithoutUserInput.schema';
import { DataSourceUncheckedUpdateWithoutUserInputObjectSchema as DataSourceUncheckedUpdateWithoutUserInputObjectSchema } from './DataSourceUncheckedUpdateWithoutUserInput.schema';
import { DataSourceCreateWithoutUserInputObjectSchema as DataSourceCreateWithoutUserInputObjectSchema } from './DataSourceCreateWithoutUserInput.schema';
import { DataSourceUncheckedCreateWithoutUserInputObjectSchema as DataSourceUncheckedCreateWithoutUserInputObjectSchema } from './DataSourceUncheckedCreateWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => DataSourceWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => DataSourceUpdateWithoutUserInputObjectSchema), z.lazy(() => DataSourceUncheckedUpdateWithoutUserInputObjectSchema)]),
  create: z.union([z.lazy(() => DataSourceCreateWithoutUserInputObjectSchema), z.lazy(() => DataSourceUncheckedCreateWithoutUserInputObjectSchema)])
}).strict();
export const DataSourceUpsertWithWhereUniqueWithoutUserInputObjectSchema: z.ZodType<Prisma.DataSourceUpsertWithWhereUniqueWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.DataSourceUpsertWithWhereUniqueWithoutUserInput>;
export const DataSourceUpsertWithWhereUniqueWithoutUserInputObjectZodSchema = makeSchema();
