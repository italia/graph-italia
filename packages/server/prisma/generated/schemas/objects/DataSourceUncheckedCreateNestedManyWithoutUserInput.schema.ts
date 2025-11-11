import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DataSourceCreateWithoutUserInputObjectSchema as DataSourceCreateWithoutUserInputObjectSchema } from './DataSourceCreateWithoutUserInput.schema';
import { DataSourceUncheckedCreateWithoutUserInputObjectSchema as DataSourceUncheckedCreateWithoutUserInputObjectSchema } from './DataSourceUncheckedCreateWithoutUserInput.schema';
import { DataSourceCreateOrConnectWithoutUserInputObjectSchema as DataSourceCreateOrConnectWithoutUserInputObjectSchema } from './DataSourceCreateOrConnectWithoutUserInput.schema';
import { DataSourceCreateManyUserInputEnvelopeObjectSchema as DataSourceCreateManyUserInputEnvelopeObjectSchema } from './DataSourceCreateManyUserInputEnvelope.schema';
import { DataSourceWhereUniqueInputObjectSchema as DataSourceWhereUniqueInputObjectSchema } from './DataSourceWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => DataSourceCreateWithoutUserInputObjectSchema), z.lazy(() => DataSourceCreateWithoutUserInputObjectSchema).array(), z.lazy(() => DataSourceUncheckedCreateWithoutUserInputObjectSchema), z.lazy(() => DataSourceUncheckedCreateWithoutUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => DataSourceCreateOrConnectWithoutUserInputObjectSchema), z.lazy(() => DataSourceCreateOrConnectWithoutUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => DataSourceCreateManyUserInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => DataSourceWhereUniqueInputObjectSchema), z.lazy(() => DataSourceWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const DataSourceUncheckedCreateNestedManyWithoutUserInputObjectSchema: z.ZodType<Prisma.DataSourceUncheckedCreateNestedManyWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.DataSourceUncheckedCreateNestedManyWithoutUserInput>;
export const DataSourceUncheckedCreateNestedManyWithoutUserInputObjectZodSchema = makeSchema();
