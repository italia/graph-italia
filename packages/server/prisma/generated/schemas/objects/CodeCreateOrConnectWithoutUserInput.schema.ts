import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CodeWhereUniqueInputObjectSchema as CodeWhereUniqueInputObjectSchema } from './CodeWhereUniqueInput.schema';
import { CodeCreateWithoutUserInputObjectSchema as CodeCreateWithoutUserInputObjectSchema } from './CodeCreateWithoutUserInput.schema';
import { CodeUncheckedCreateWithoutUserInputObjectSchema as CodeUncheckedCreateWithoutUserInputObjectSchema } from './CodeUncheckedCreateWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CodeWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => CodeCreateWithoutUserInputObjectSchema), z.lazy(() => CodeUncheckedCreateWithoutUserInputObjectSchema)])
}).strict();
export const CodeCreateOrConnectWithoutUserInputObjectSchema: z.ZodType<Prisma.CodeCreateOrConnectWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.CodeCreateOrConnectWithoutUserInput>;
export const CodeCreateOrConnectWithoutUserInputObjectZodSchema = makeSchema();
