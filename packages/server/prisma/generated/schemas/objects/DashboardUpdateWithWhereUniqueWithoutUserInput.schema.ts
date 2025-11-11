import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DashboardWhereUniqueInputObjectSchema as DashboardWhereUniqueInputObjectSchema } from './DashboardWhereUniqueInput.schema';
import { DashboardUpdateWithoutUserInputObjectSchema as DashboardUpdateWithoutUserInputObjectSchema } from './DashboardUpdateWithoutUserInput.schema';
import { DashboardUncheckedUpdateWithoutUserInputObjectSchema as DashboardUncheckedUpdateWithoutUserInputObjectSchema } from './DashboardUncheckedUpdateWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => DashboardWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => DashboardUpdateWithoutUserInputObjectSchema), z.lazy(() => DashboardUncheckedUpdateWithoutUserInputObjectSchema)])
}).strict();
export const DashboardUpdateWithWhereUniqueWithoutUserInputObjectSchema: z.ZodType<Prisma.DashboardUpdateWithWhereUniqueWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.DashboardUpdateWithWhereUniqueWithoutUserInput>;
export const DashboardUpdateWithWhereUniqueWithoutUserInputObjectZodSchema = makeSchema();
