import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DashboardScalarWhereInputObjectSchema as DashboardScalarWhereInputObjectSchema } from './DashboardScalarWhereInput.schema';
import { DashboardUpdateManyMutationInputObjectSchema as DashboardUpdateManyMutationInputObjectSchema } from './DashboardUpdateManyMutationInput.schema';
import { DashboardUncheckedUpdateManyWithoutUserInputObjectSchema as DashboardUncheckedUpdateManyWithoutUserInputObjectSchema } from './DashboardUncheckedUpdateManyWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => DashboardScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => DashboardUpdateManyMutationInputObjectSchema), z.lazy(() => DashboardUncheckedUpdateManyWithoutUserInputObjectSchema)])
}).strict();
export const DashboardUpdateManyWithWhereWithoutUserInputObjectSchema: z.ZodType<Prisma.DashboardUpdateManyWithWhereWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.DashboardUpdateManyWithWhereWithoutUserInput>;
export const DashboardUpdateManyWithWhereWithoutUserInputObjectZodSchema = makeSchema();
