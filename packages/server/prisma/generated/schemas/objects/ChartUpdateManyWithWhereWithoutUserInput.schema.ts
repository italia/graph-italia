import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ChartScalarWhereInputObjectSchema as ChartScalarWhereInputObjectSchema } from './ChartScalarWhereInput.schema';
import { ChartUpdateManyMutationInputObjectSchema as ChartUpdateManyMutationInputObjectSchema } from './ChartUpdateManyMutationInput.schema';
import { ChartUncheckedUpdateManyWithoutUserInputObjectSchema as ChartUncheckedUpdateManyWithoutUserInputObjectSchema } from './ChartUncheckedUpdateManyWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ChartScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => ChartUpdateManyMutationInputObjectSchema), z.lazy(() => ChartUncheckedUpdateManyWithoutUserInputObjectSchema)])
}).strict();
export const ChartUpdateManyWithWhereWithoutUserInputObjectSchema: z.ZodType<Prisma.ChartUpdateManyWithWhereWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.ChartUpdateManyWithWhereWithoutUserInput>;
export const ChartUpdateManyWithWhereWithoutUserInputObjectZodSchema = makeSchema();
