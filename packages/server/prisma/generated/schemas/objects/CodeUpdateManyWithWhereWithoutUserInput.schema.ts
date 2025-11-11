import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CodeScalarWhereInputObjectSchema as CodeScalarWhereInputObjectSchema } from './CodeScalarWhereInput.schema';
import { CodeUpdateManyMutationInputObjectSchema as CodeUpdateManyMutationInputObjectSchema } from './CodeUpdateManyMutationInput.schema';
import { CodeUncheckedUpdateManyWithoutUserInputObjectSchema as CodeUncheckedUpdateManyWithoutUserInputObjectSchema } from './CodeUncheckedUpdateManyWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CodeScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => CodeUpdateManyMutationInputObjectSchema), z.lazy(() => CodeUncheckedUpdateManyWithoutUserInputObjectSchema)])
}).strict();
export const CodeUpdateManyWithWhereWithoutUserInputObjectSchema: z.ZodType<Prisma.CodeUpdateManyWithWhereWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.CodeUpdateManyWithWhereWithoutUserInput>;
export const CodeUpdateManyWithWhereWithoutUserInputObjectZodSchema = makeSchema();
