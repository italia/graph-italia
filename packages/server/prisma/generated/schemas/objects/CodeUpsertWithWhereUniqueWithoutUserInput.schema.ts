import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CodeWhereUniqueInputObjectSchema as CodeWhereUniqueInputObjectSchema } from './CodeWhereUniqueInput.schema';
import { CodeUpdateWithoutUserInputObjectSchema as CodeUpdateWithoutUserInputObjectSchema } from './CodeUpdateWithoutUserInput.schema';
import { CodeUncheckedUpdateWithoutUserInputObjectSchema as CodeUncheckedUpdateWithoutUserInputObjectSchema } from './CodeUncheckedUpdateWithoutUserInput.schema';
import { CodeCreateWithoutUserInputObjectSchema as CodeCreateWithoutUserInputObjectSchema } from './CodeCreateWithoutUserInput.schema';
import { CodeUncheckedCreateWithoutUserInputObjectSchema as CodeUncheckedCreateWithoutUserInputObjectSchema } from './CodeUncheckedCreateWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CodeWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => CodeUpdateWithoutUserInputObjectSchema), z.lazy(() => CodeUncheckedUpdateWithoutUserInputObjectSchema)]),
  create: z.union([z.lazy(() => CodeCreateWithoutUserInputObjectSchema), z.lazy(() => CodeUncheckedCreateWithoutUserInputObjectSchema)])
}).strict();
export const CodeUpsertWithWhereUniqueWithoutUserInputObjectSchema: z.ZodType<Prisma.CodeUpsertWithWhereUniqueWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.CodeUpsertWithWhereUniqueWithoutUserInput>;
export const CodeUpsertWithWhereUniqueWithoutUserInputObjectZodSchema = makeSchema();
