import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DashboardWhereUniqueInputObjectSchema as DashboardWhereUniqueInputObjectSchema } from './DashboardWhereUniqueInput.schema';
import { DashboardUpdateWithoutUserInputObjectSchema as DashboardUpdateWithoutUserInputObjectSchema } from './DashboardUpdateWithoutUserInput.schema';
import { DashboardUncheckedUpdateWithoutUserInputObjectSchema as DashboardUncheckedUpdateWithoutUserInputObjectSchema } from './DashboardUncheckedUpdateWithoutUserInput.schema';
import { DashboardCreateWithoutUserInputObjectSchema as DashboardCreateWithoutUserInputObjectSchema } from './DashboardCreateWithoutUserInput.schema';
import { DashboardUncheckedCreateWithoutUserInputObjectSchema as DashboardUncheckedCreateWithoutUserInputObjectSchema } from './DashboardUncheckedCreateWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => DashboardWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => DashboardUpdateWithoutUserInputObjectSchema), z.lazy(() => DashboardUncheckedUpdateWithoutUserInputObjectSchema)]),
  create: z.union([z.lazy(() => DashboardCreateWithoutUserInputObjectSchema), z.lazy(() => DashboardUncheckedCreateWithoutUserInputObjectSchema)])
}).strict();
export const DashboardUpsertWithWhereUniqueWithoutUserInputObjectSchema: z.ZodType<Prisma.DashboardUpsertWithWhereUniqueWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.DashboardUpsertWithWhereUniqueWithoutUserInput>;
export const DashboardUpsertWithWhereUniqueWithoutUserInputObjectZodSchema = makeSchema();
