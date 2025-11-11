import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CodeCreateWithoutUserInputObjectSchema as CodeCreateWithoutUserInputObjectSchema } from './CodeCreateWithoutUserInput.schema';
import { CodeUncheckedCreateWithoutUserInputObjectSchema as CodeUncheckedCreateWithoutUserInputObjectSchema } from './CodeUncheckedCreateWithoutUserInput.schema';
import { CodeCreateOrConnectWithoutUserInputObjectSchema as CodeCreateOrConnectWithoutUserInputObjectSchema } from './CodeCreateOrConnectWithoutUserInput.schema';
import { CodeUpsertWithWhereUniqueWithoutUserInputObjectSchema as CodeUpsertWithWhereUniqueWithoutUserInputObjectSchema } from './CodeUpsertWithWhereUniqueWithoutUserInput.schema';
import { CodeCreateManyUserInputEnvelopeObjectSchema as CodeCreateManyUserInputEnvelopeObjectSchema } from './CodeCreateManyUserInputEnvelope.schema';
import { CodeWhereUniqueInputObjectSchema as CodeWhereUniqueInputObjectSchema } from './CodeWhereUniqueInput.schema';
import { CodeUpdateWithWhereUniqueWithoutUserInputObjectSchema as CodeUpdateWithWhereUniqueWithoutUserInputObjectSchema } from './CodeUpdateWithWhereUniqueWithoutUserInput.schema';
import { CodeUpdateManyWithWhereWithoutUserInputObjectSchema as CodeUpdateManyWithWhereWithoutUserInputObjectSchema } from './CodeUpdateManyWithWhereWithoutUserInput.schema';
import { CodeScalarWhereInputObjectSchema as CodeScalarWhereInputObjectSchema } from './CodeScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => CodeCreateWithoutUserInputObjectSchema), z.lazy(() => CodeCreateWithoutUserInputObjectSchema).array(), z.lazy(() => CodeUncheckedCreateWithoutUserInputObjectSchema), z.lazy(() => CodeUncheckedCreateWithoutUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => CodeCreateOrConnectWithoutUserInputObjectSchema), z.lazy(() => CodeCreateOrConnectWithoutUserInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => CodeUpsertWithWhereUniqueWithoutUserInputObjectSchema), z.lazy(() => CodeUpsertWithWhereUniqueWithoutUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => CodeCreateManyUserInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => CodeWhereUniqueInputObjectSchema), z.lazy(() => CodeWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => CodeWhereUniqueInputObjectSchema), z.lazy(() => CodeWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => CodeWhereUniqueInputObjectSchema), z.lazy(() => CodeWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => CodeWhereUniqueInputObjectSchema), z.lazy(() => CodeWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => CodeUpdateWithWhereUniqueWithoutUserInputObjectSchema), z.lazy(() => CodeUpdateWithWhereUniqueWithoutUserInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => CodeUpdateManyWithWhereWithoutUserInputObjectSchema), z.lazy(() => CodeUpdateManyWithWhereWithoutUserInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => CodeScalarWhereInputObjectSchema), z.lazy(() => CodeScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const CodeUpdateManyWithoutUserNestedInputObjectSchema: z.ZodType<Prisma.CodeUpdateManyWithoutUserNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.CodeUpdateManyWithoutUserNestedInput>;
export const CodeUpdateManyWithoutUserNestedInputObjectZodSchema = makeSchema();
