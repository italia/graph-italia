import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ChartWhereUniqueInputObjectSchema as ChartWhereUniqueInputObjectSchema } from './ChartWhereUniqueInput.schema';
import { ChartCreateWithoutSourceLinkInputObjectSchema as ChartCreateWithoutSourceLinkInputObjectSchema } from './ChartCreateWithoutSourceLinkInput.schema';
import { ChartUncheckedCreateWithoutSourceLinkInputObjectSchema as ChartUncheckedCreateWithoutSourceLinkInputObjectSchema } from './ChartUncheckedCreateWithoutSourceLinkInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ChartWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ChartCreateWithoutSourceLinkInputObjectSchema), z.lazy(() => ChartUncheckedCreateWithoutSourceLinkInputObjectSchema)])
}).strict();
export const ChartCreateOrConnectWithoutSourceLinkInputObjectSchema: z.ZodType<Prisma.ChartCreateOrConnectWithoutSourceLinkInput> = makeSchema() as unknown as z.ZodType<Prisma.ChartCreateOrConnectWithoutSourceLinkInput>;
export const ChartCreateOrConnectWithoutSourceLinkInputObjectZodSchema = makeSchema();
