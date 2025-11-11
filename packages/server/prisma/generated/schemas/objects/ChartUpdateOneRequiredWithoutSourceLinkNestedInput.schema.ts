import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ChartCreateWithoutSourceLinkInputObjectSchema as ChartCreateWithoutSourceLinkInputObjectSchema } from './ChartCreateWithoutSourceLinkInput.schema';
import { ChartUncheckedCreateWithoutSourceLinkInputObjectSchema as ChartUncheckedCreateWithoutSourceLinkInputObjectSchema } from './ChartUncheckedCreateWithoutSourceLinkInput.schema';
import { ChartCreateOrConnectWithoutSourceLinkInputObjectSchema as ChartCreateOrConnectWithoutSourceLinkInputObjectSchema } from './ChartCreateOrConnectWithoutSourceLinkInput.schema';
import { ChartUpsertWithoutSourceLinkInputObjectSchema as ChartUpsertWithoutSourceLinkInputObjectSchema } from './ChartUpsertWithoutSourceLinkInput.schema';
import { ChartWhereUniqueInputObjectSchema as ChartWhereUniqueInputObjectSchema } from './ChartWhereUniqueInput.schema';
import { ChartUpdateToOneWithWhereWithoutSourceLinkInputObjectSchema as ChartUpdateToOneWithWhereWithoutSourceLinkInputObjectSchema } from './ChartUpdateToOneWithWhereWithoutSourceLinkInput.schema';
import { ChartUpdateWithoutSourceLinkInputObjectSchema as ChartUpdateWithoutSourceLinkInputObjectSchema } from './ChartUpdateWithoutSourceLinkInput.schema';
import { ChartUncheckedUpdateWithoutSourceLinkInputObjectSchema as ChartUncheckedUpdateWithoutSourceLinkInputObjectSchema } from './ChartUncheckedUpdateWithoutSourceLinkInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ChartCreateWithoutSourceLinkInputObjectSchema), z.lazy(() => ChartUncheckedCreateWithoutSourceLinkInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ChartCreateOrConnectWithoutSourceLinkInputObjectSchema).optional(),
  upsert: z.lazy(() => ChartUpsertWithoutSourceLinkInputObjectSchema).optional(),
  connect: z.lazy(() => ChartWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ChartUpdateToOneWithWhereWithoutSourceLinkInputObjectSchema), z.lazy(() => ChartUpdateWithoutSourceLinkInputObjectSchema), z.lazy(() => ChartUncheckedUpdateWithoutSourceLinkInputObjectSchema)]).optional()
}).strict();
export const ChartUpdateOneRequiredWithoutSourceLinkNestedInputObjectSchema: z.ZodType<Prisma.ChartUpdateOneRequiredWithoutSourceLinkNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ChartUpdateOneRequiredWithoutSourceLinkNestedInput>;
export const ChartUpdateOneRequiredWithoutSourceLinkNestedInputObjectZodSchema = makeSchema();
