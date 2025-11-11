import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DashboardCreateWithoutUserInputObjectSchema as DashboardCreateWithoutUserInputObjectSchema } from './DashboardCreateWithoutUserInput.schema';
import { DashboardUncheckedCreateWithoutUserInputObjectSchema as DashboardUncheckedCreateWithoutUserInputObjectSchema } from './DashboardUncheckedCreateWithoutUserInput.schema';
import { DashboardCreateOrConnectWithoutUserInputObjectSchema as DashboardCreateOrConnectWithoutUserInputObjectSchema } from './DashboardCreateOrConnectWithoutUserInput.schema';
import { DashboardCreateManyUserInputEnvelopeObjectSchema as DashboardCreateManyUserInputEnvelopeObjectSchema } from './DashboardCreateManyUserInputEnvelope.schema';
import { DashboardWhereUniqueInputObjectSchema as DashboardWhereUniqueInputObjectSchema } from './DashboardWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => DashboardCreateWithoutUserInputObjectSchema), z.lazy(() => DashboardCreateWithoutUserInputObjectSchema).array(), z.lazy(() => DashboardUncheckedCreateWithoutUserInputObjectSchema), z.lazy(() => DashboardUncheckedCreateWithoutUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => DashboardCreateOrConnectWithoutUserInputObjectSchema), z.lazy(() => DashboardCreateOrConnectWithoutUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => DashboardCreateManyUserInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => DashboardWhereUniqueInputObjectSchema), z.lazy(() => DashboardWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const DashboardUncheckedCreateNestedManyWithoutUserInputObjectSchema: z.ZodType<Prisma.DashboardUncheckedCreateNestedManyWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.DashboardUncheckedCreateNestedManyWithoutUserInput>;
export const DashboardUncheckedCreateNestedManyWithoutUserInputObjectZodSchema = makeSchema();
