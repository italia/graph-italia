import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DataSourceScalarWhereInputObjectSchema as DataSourceScalarWhereInputObjectSchema } from './DataSourceScalarWhereInput.schema';
import { DataSourceUpdateManyMutationInputObjectSchema as DataSourceUpdateManyMutationInputObjectSchema } from './DataSourceUpdateManyMutationInput.schema';
import { DataSourceUncheckedUpdateManyWithoutUserInputObjectSchema as DataSourceUncheckedUpdateManyWithoutUserInputObjectSchema } from './DataSourceUncheckedUpdateManyWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => DataSourceScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => DataSourceUpdateManyMutationInputObjectSchema), z.lazy(() => DataSourceUncheckedUpdateManyWithoutUserInputObjectSchema)])
}).strict();
export const DataSourceUpdateManyWithWhereWithoutUserInputObjectSchema: z.ZodType<Prisma.DataSourceUpdateManyWithWhereWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.DataSourceUpdateManyWithWhereWithoutUserInput>;
export const DataSourceUpdateManyWithWhereWithoutUserInputObjectZodSchema = makeSchema();
