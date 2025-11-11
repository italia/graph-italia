import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SlotScalarWhereInputObjectSchema as SlotScalarWhereInputObjectSchema } from './SlotScalarWhereInput.schema';
import { SlotUpdateManyMutationInputObjectSchema as SlotUpdateManyMutationInputObjectSchema } from './SlotUpdateManyMutationInput.schema';
import { SlotUncheckedUpdateManyWithoutDashboardInputObjectSchema as SlotUncheckedUpdateManyWithoutDashboardInputObjectSchema } from './SlotUncheckedUpdateManyWithoutDashboardInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SlotScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => SlotUpdateManyMutationInputObjectSchema), z.lazy(() => SlotUncheckedUpdateManyWithoutDashboardInputObjectSchema)])
}).strict();
export const SlotUpdateManyWithWhereWithoutDashboardInputObjectSchema: z.ZodType<Prisma.SlotUpdateManyWithWhereWithoutDashboardInput> = makeSchema() as unknown as z.ZodType<Prisma.SlotUpdateManyWithWhereWithoutDashboardInput>;
export const SlotUpdateManyWithWhereWithoutDashboardInputObjectZodSchema = makeSchema();
