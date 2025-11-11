import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CodeWhereUniqueInputObjectSchema as CodeWhereUniqueInputObjectSchema } from './CodeWhereUniqueInput.schema';
import { CodeUpdateWithoutUserInputObjectSchema as CodeUpdateWithoutUserInputObjectSchema } from './CodeUpdateWithoutUserInput.schema';
import { CodeUncheckedUpdateWithoutUserInputObjectSchema as CodeUncheckedUpdateWithoutUserInputObjectSchema } from './CodeUncheckedUpdateWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CodeWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => CodeUpdateWithoutUserInputObjectSchema), z.lazy(() => CodeUncheckedUpdateWithoutUserInputObjectSchema)])
}).strict();
export const CodeUpdateWithWhereUniqueWithoutUserInputObjectSchema: z.ZodType<Prisma.CodeUpdateWithWhereUniqueWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.CodeUpdateWithWhereUniqueWithoutUserInput>;
export const CodeUpdateWithWhereUniqueWithoutUserInputObjectZodSchema = makeSchema();
