import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SourceLinkWhereUniqueInputObjectSchema as SourceLinkWhereUniqueInputObjectSchema } from './SourceLinkWhereUniqueInput.schema';
import { SourceLinkUpdateWithoutChartInputObjectSchema as SourceLinkUpdateWithoutChartInputObjectSchema } from './SourceLinkUpdateWithoutChartInput.schema';
import { SourceLinkUncheckedUpdateWithoutChartInputObjectSchema as SourceLinkUncheckedUpdateWithoutChartInputObjectSchema } from './SourceLinkUncheckedUpdateWithoutChartInput.schema';
import { SourceLinkCreateWithoutChartInputObjectSchema as SourceLinkCreateWithoutChartInputObjectSchema } from './SourceLinkCreateWithoutChartInput.schema';
import { SourceLinkUncheckedCreateWithoutChartInputObjectSchema as SourceLinkUncheckedCreateWithoutChartInputObjectSchema } from './SourceLinkUncheckedCreateWithoutChartInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SourceLinkWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => SourceLinkUpdateWithoutChartInputObjectSchema), z.lazy(() => SourceLinkUncheckedUpdateWithoutChartInputObjectSchema)]),
  create: z.union([z.lazy(() => SourceLinkCreateWithoutChartInputObjectSchema), z.lazy(() => SourceLinkUncheckedCreateWithoutChartInputObjectSchema)])
}).strict();
export const SourceLinkUpsertWithWhereUniqueWithoutChartInputObjectSchema: z.ZodType<Prisma.SourceLinkUpsertWithWhereUniqueWithoutChartInput> = makeSchema() as unknown as z.ZodType<Prisma.SourceLinkUpsertWithWhereUniqueWithoutChartInput>;
export const SourceLinkUpsertWithWhereUniqueWithoutChartInputObjectZodSchema = makeSchema();
