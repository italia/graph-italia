import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ChartCreateWithoutSourceLinkInputObjectSchema as ChartCreateWithoutSourceLinkInputObjectSchema } from './ChartCreateWithoutSourceLinkInput.schema';
import { ChartUncheckedCreateWithoutSourceLinkInputObjectSchema as ChartUncheckedCreateWithoutSourceLinkInputObjectSchema } from './ChartUncheckedCreateWithoutSourceLinkInput.schema';
import { ChartCreateOrConnectWithoutSourceLinkInputObjectSchema as ChartCreateOrConnectWithoutSourceLinkInputObjectSchema } from './ChartCreateOrConnectWithoutSourceLinkInput.schema';
import { ChartWhereUniqueInputObjectSchema as ChartWhereUniqueInputObjectSchema } from './ChartWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ChartCreateWithoutSourceLinkInputObjectSchema), z.lazy(() => ChartUncheckedCreateWithoutSourceLinkInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ChartCreateOrConnectWithoutSourceLinkInputObjectSchema).optional(),
  connect: z.lazy(() => ChartWhereUniqueInputObjectSchema).optional()
}).strict();
export const ChartCreateNestedOneWithoutSourceLinkInputObjectSchema: z.ZodType<Prisma.ChartCreateNestedOneWithoutSourceLinkInput> = makeSchema() as unknown as z.ZodType<Prisma.ChartCreateNestedOneWithoutSourceLinkInput>;
export const ChartCreateNestedOneWithoutSourceLinkInputObjectZodSchema = makeSchema();
