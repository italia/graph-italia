import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CodeCreateWithoutUserInputObjectSchema as CodeCreateWithoutUserInputObjectSchema } from './CodeCreateWithoutUserInput.schema';
import { CodeUncheckedCreateWithoutUserInputObjectSchema as CodeUncheckedCreateWithoutUserInputObjectSchema } from './CodeUncheckedCreateWithoutUserInput.schema';
import { CodeCreateOrConnectWithoutUserInputObjectSchema as CodeCreateOrConnectWithoutUserInputObjectSchema } from './CodeCreateOrConnectWithoutUserInput.schema';
import { CodeCreateManyUserInputEnvelopeObjectSchema as CodeCreateManyUserInputEnvelopeObjectSchema } from './CodeCreateManyUserInputEnvelope.schema';
import { CodeWhereUniqueInputObjectSchema as CodeWhereUniqueInputObjectSchema } from './CodeWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => CodeCreateWithoutUserInputObjectSchema), z.lazy(() => CodeCreateWithoutUserInputObjectSchema).array(), z.lazy(() => CodeUncheckedCreateWithoutUserInputObjectSchema), z.lazy(() => CodeUncheckedCreateWithoutUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => CodeCreateOrConnectWithoutUserInputObjectSchema), z.lazy(() => CodeCreateOrConnectWithoutUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => CodeCreateManyUserInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => CodeWhereUniqueInputObjectSchema), z.lazy(() => CodeWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const CodeCreateNestedManyWithoutUserInputObjectSchema: z.ZodType<Prisma.CodeCreateNestedManyWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.CodeCreateNestedManyWithoutUserInput>;
export const CodeCreateNestedManyWithoutUserInputObjectZodSchema = makeSchema();
