import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ChartUpdateWithoutSourceLinkInputObjectSchema as ChartUpdateWithoutSourceLinkInputObjectSchema } from './ChartUpdateWithoutSourceLinkInput.schema';
import { ChartUncheckedUpdateWithoutSourceLinkInputObjectSchema as ChartUncheckedUpdateWithoutSourceLinkInputObjectSchema } from './ChartUncheckedUpdateWithoutSourceLinkInput.schema';
import { ChartCreateWithoutSourceLinkInputObjectSchema as ChartCreateWithoutSourceLinkInputObjectSchema } from './ChartCreateWithoutSourceLinkInput.schema';
import { ChartUncheckedCreateWithoutSourceLinkInputObjectSchema as ChartUncheckedCreateWithoutSourceLinkInputObjectSchema } from './ChartUncheckedCreateWithoutSourceLinkInput.schema';
import { ChartWhereInputObjectSchema as ChartWhereInputObjectSchema } from './ChartWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ChartUpdateWithoutSourceLinkInputObjectSchema), z.lazy(() => ChartUncheckedUpdateWithoutSourceLinkInputObjectSchema)]),
  create: z.union([z.lazy(() => ChartCreateWithoutSourceLinkInputObjectSchema), z.lazy(() => ChartUncheckedCreateWithoutSourceLinkInputObjectSchema)]),
  where: z.lazy(() => ChartWhereInputObjectSchema).optional()
}).strict();
export const ChartUpsertWithoutSourceLinkInputObjectSchema: z.ZodType<Prisma.ChartUpsertWithoutSourceLinkInput> = makeSchema() as unknown as z.ZodType<Prisma.ChartUpsertWithoutSourceLinkInput>;
export const ChartUpsertWithoutSourceLinkInputObjectZodSchema = makeSchema();
