import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SlotWhereInputObjectSchema as SlotWhereInputObjectSchema } from './SlotWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => SlotWhereInputObjectSchema).optional(),
  some: z.lazy(() => SlotWhereInputObjectSchema).optional(),
  none: z.lazy(() => SlotWhereInputObjectSchema).optional()
}).strict();
export const SlotListRelationFilterObjectSchema: z.ZodType<Prisma.SlotListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.SlotListRelationFilter>;
export const SlotListRelationFilterObjectZodSchema = makeSchema();
