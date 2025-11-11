import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DataSourceWhereUniqueInputObjectSchema as DataSourceWhereUniqueInputObjectSchema } from './DataSourceWhereUniqueInput.schema';
import { DataSourceUpdateWithoutUserInputObjectSchema as DataSourceUpdateWithoutUserInputObjectSchema } from './DataSourceUpdateWithoutUserInput.schema';
import { DataSourceUncheckedUpdateWithoutUserInputObjectSchema as DataSourceUncheckedUpdateWithoutUserInputObjectSchema } from './DataSourceUncheckedUpdateWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => DataSourceWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => DataSourceUpdateWithoutUserInputObjectSchema), z.lazy(() => DataSourceUncheckedUpdateWithoutUserInputObjectSchema)])
}).strict();
export const DataSourceUpdateWithWhereUniqueWithoutUserInputObjectSchema: z.ZodType<Prisma.DataSourceUpdateWithWhereUniqueWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.DataSourceUpdateWithWhereUniqueWithoutUserInput>;
export const DataSourceUpdateWithWhereUniqueWithoutUserInputObjectZodSchema = makeSchema();
