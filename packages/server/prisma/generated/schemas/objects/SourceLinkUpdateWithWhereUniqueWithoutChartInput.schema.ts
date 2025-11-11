import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SourceLinkWhereUniqueInputObjectSchema as SourceLinkWhereUniqueInputObjectSchema } from './SourceLinkWhereUniqueInput.schema';
import { SourceLinkUpdateWithoutChartInputObjectSchema as SourceLinkUpdateWithoutChartInputObjectSchema } from './SourceLinkUpdateWithoutChartInput.schema';
import { SourceLinkUncheckedUpdateWithoutChartInputObjectSchema as SourceLinkUncheckedUpdateWithoutChartInputObjectSchema } from './SourceLinkUncheckedUpdateWithoutChartInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SourceLinkWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => SourceLinkUpdateWithoutChartInputObjectSchema), z.lazy(() => SourceLinkUncheckedUpdateWithoutChartInputObjectSchema)])
}).strict();
export const SourceLinkUpdateWithWhereUniqueWithoutChartInputObjectSchema: z.ZodType<Prisma.SourceLinkUpdateWithWhereUniqueWithoutChartInput> = makeSchema() as unknown as z.ZodType<Prisma.SourceLinkUpdateWithWhereUniqueWithoutChartInput>;
export const SourceLinkUpdateWithWhereUniqueWithoutChartInputObjectZodSchema = makeSchema();
