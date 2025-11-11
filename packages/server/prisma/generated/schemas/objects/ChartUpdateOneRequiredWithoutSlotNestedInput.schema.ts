import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ChartCreateWithoutSlotInputObjectSchema as ChartCreateWithoutSlotInputObjectSchema } from './ChartCreateWithoutSlotInput.schema';
import { ChartUncheckedCreateWithoutSlotInputObjectSchema as ChartUncheckedCreateWithoutSlotInputObjectSchema } from './ChartUncheckedCreateWithoutSlotInput.schema';
import { ChartCreateOrConnectWithoutSlotInputObjectSchema as ChartCreateOrConnectWithoutSlotInputObjectSchema } from './ChartCreateOrConnectWithoutSlotInput.schema';
import { ChartUpsertWithoutSlotInputObjectSchema as ChartUpsertWithoutSlotInputObjectSchema } from './ChartUpsertWithoutSlotInput.schema';
import { ChartWhereUniqueInputObjectSchema as ChartWhereUniqueInputObjectSchema } from './ChartWhereUniqueInput.schema';
import { ChartUpdateToOneWithWhereWithoutSlotInputObjectSchema as ChartUpdateToOneWithWhereWithoutSlotInputObjectSchema } from './ChartUpdateToOneWithWhereWithoutSlotInput.schema';
import { ChartUpdateWithoutSlotInputObjectSchema as ChartUpdateWithoutSlotInputObjectSchema } from './ChartUpdateWithoutSlotInput.schema';
import { ChartUncheckedUpdateWithoutSlotInputObjectSchema as ChartUncheckedUpdateWithoutSlotInputObjectSchema } from './ChartUncheckedUpdateWithoutSlotInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ChartCreateWithoutSlotInputObjectSchema), z.lazy(() => ChartUncheckedCreateWithoutSlotInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ChartCreateOrConnectWithoutSlotInputObjectSchema).optional(),
  upsert: z.lazy(() => ChartUpsertWithoutSlotInputObjectSchema).optional(),
  connect: z.lazy(() => ChartWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ChartUpdateToOneWithWhereWithoutSlotInputObjectSchema), z.lazy(() => ChartUpdateWithoutSlotInputObjectSchema), z.lazy(() => ChartUncheckedUpdateWithoutSlotInputObjectSchema)]).optional()
}).strict();
export const ChartUpdateOneRequiredWithoutSlotNestedInputObjectSchema: z.ZodType<Prisma.ChartUpdateOneRequiredWithoutSlotNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ChartUpdateOneRequiredWithoutSlotNestedInput>;
export const ChartUpdateOneRequiredWithoutSlotNestedInputObjectZodSchema = makeSchema();
