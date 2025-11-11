import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SourceLinkScalarWhereInputObjectSchema as SourceLinkScalarWhereInputObjectSchema } from './SourceLinkScalarWhereInput.schema';
import { SourceLinkUpdateManyMutationInputObjectSchema as SourceLinkUpdateManyMutationInputObjectSchema } from './SourceLinkUpdateManyMutationInput.schema';
import { SourceLinkUncheckedUpdateManyWithoutChartInputObjectSchema as SourceLinkUncheckedUpdateManyWithoutChartInputObjectSchema } from './SourceLinkUncheckedUpdateManyWithoutChartInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SourceLinkScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => SourceLinkUpdateManyMutationInputObjectSchema), z.lazy(() => SourceLinkUncheckedUpdateManyWithoutChartInputObjectSchema)])
}).strict();
export const SourceLinkUpdateManyWithWhereWithoutChartInputObjectSchema: z.ZodType<Prisma.SourceLinkUpdateManyWithWhereWithoutChartInput> = makeSchema() as unknown as z.ZodType<Prisma.SourceLinkUpdateManyWithWhereWithoutChartInput>;
export const SourceLinkUpdateManyWithWhereWithoutChartInputObjectZodSchema = makeSchema();
