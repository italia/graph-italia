import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ChartWhereInputObjectSchema as ChartWhereInputObjectSchema } from './ChartWhereInput.schema';
import { ChartUpdateWithoutSourceLinkInputObjectSchema as ChartUpdateWithoutSourceLinkInputObjectSchema } from './ChartUpdateWithoutSourceLinkInput.schema';
import { ChartUncheckedUpdateWithoutSourceLinkInputObjectSchema as ChartUncheckedUpdateWithoutSourceLinkInputObjectSchema } from './ChartUncheckedUpdateWithoutSourceLinkInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ChartWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ChartUpdateWithoutSourceLinkInputObjectSchema), z.lazy(() => ChartUncheckedUpdateWithoutSourceLinkInputObjectSchema)])
}).strict();
export const ChartUpdateToOneWithWhereWithoutSourceLinkInputObjectSchema: z.ZodType<Prisma.ChartUpdateToOneWithWhereWithoutSourceLinkInput> = makeSchema() as unknown as z.ZodType<Prisma.ChartUpdateToOneWithWhereWithoutSourceLinkInput>;
export const ChartUpdateToOneWithWhereWithoutSourceLinkInputObjectZodSchema = makeSchema();
