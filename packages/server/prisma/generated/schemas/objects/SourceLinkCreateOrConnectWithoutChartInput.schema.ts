import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SourceLinkWhereUniqueInputObjectSchema as SourceLinkWhereUniqueInputObjectSchema } from './SourceLinkWhereUniqueInput.schema';
import { SourceLinkCreateWithoutChartInputObjectSchema as SourceLinkCreateWithoutChartInputObjectSchema } from './SourceLinkCreateWithoutChartInput.schema';
import { SourceLinkUncheckedCreateWithoutChartInputObjectSchema as SourceLinkUncheckedCreateWithoutChartInputObjectSchema } from './SourceLinkUncheckedCreateWithoutChartInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SourceLinkWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => SourceLinkCreateWithoutChartInputObjectSchema), z.lazy(() => SourceLinkUncheckedCreateWithoutChartInputObjectSchema)])
}).strict();
export const SourceLinkCreateOrConnectWithoutChartInputObjectSchema: z.ZodType<Prisma.SourceLinkCreateOrConnectWithoutChartInput> = makeSchema() as unknown as z.ZodType<Prisma.SourceLinkCreateOrConnectWithoutChartInput>;
export const SourceLinkCreateOrConnectWithoutChartInputObjectZodSchema = makeSchema();
