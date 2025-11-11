import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SlotCreateManyDashboardInputObjectSchema as SlotCreateManyDashboardInputObjectSchema } from './SlotCreateManyDashboardInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => SlotCreateManyDashboardInputObjectSchema), z.lazy(() => SlotCreateManyDashboardInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const SlotCreateManyDashboardInputEnvelopeObjectSchema: z.ZodType<Prisma.SlotCreateManyDashboardInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.SlotCreateManyDashboardInputEnvelope>;
export const SlotCreateManyDashboardInputEnvelopeObjectZodSchema = makeSchema();
