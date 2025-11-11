import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SlotScalarWhereInputObjectSchema as SlotScalarWhereInputObjectSchema } from './SlotScalarWhereInput.schema';
import { SlotUpdateManyMutationInputObjectSchema as SlotUpdateManyMutationInputObjectSchema } from './SlotUpdateManyMutationInput.schema';
import { SlotUncheckedUpdateManyWithoutChartInputObjectSchema as SlotUncheckedUpdateManyWithoutChartInputObjectSchema } from './SlotUncheckedUpdateManyWithoutChartInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SlotScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => SlotUpdateManyMutationInputObjectSchema), z.lazy(() => SlotUncheckedUpdateManyWithoutChartInputObjectSchema)])
}).strict();
export const SlotUpdateManyWithWhereWithoutChartInputObjectSchema: z.ZodType<Prisma.SlotUpdateManyWithWhereWithoutChartInput> = makeSchema() as unknown as z.ZodType<Prisma.SlotUpdateManyWithWhereWithoutChartInput>;
export const SlotUpdateManyWithWhereWithoutChartInputObjectZodSchema = makeSchema();
