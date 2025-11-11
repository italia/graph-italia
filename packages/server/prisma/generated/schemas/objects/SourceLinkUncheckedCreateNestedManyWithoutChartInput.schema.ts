import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SourceLinkCreateWithoutChartInputObjectSchema as SourceLinkCreateWithoutChartInputObjectSchema } from './SourceLinkCreateWithoutChartInput.schema';
import { SourceLinkUncheckedCreateWithoutChartInputObjectSchema as SourceLinkUncheckedCreateWithoutChartInputObjectSchema } from './SourceLinkUncheckedCreateWithoutChartInput.schema';
import { SourceLinkCreateOrConnectWithoutChartInputObjectSchema as SourceLinkCreateOrConnectWithoutChartInputObjectSchema } from './SourceLinkCreateOrConnectWithoutChartInput.schema';
import { SourceLinkCreateManyChartInputEnvelopeObjectSchema as SourceLinkCreateManyChartInputEnvelopeObjectSchema } from './SourceLinkCreateManyChartInputEnvelope.schema';
import { SourceLinkWhereUniqueInputObjectSchema as SourceLinkWhereUniqueInputObjectSchema } from './SourceLinkWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => SourceLinkCreateWithoutChartInputObjectSchema), z.lazy(() => SourceLinkCreateWithoutChartInputObjectSchema).array(), z.lazy(() => SourceLinkUncheckedCreateWithoutChartInputObjectSchema), z.lazy(() => SourceLinkUncheckedCreateWithoutChartInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => SourceLinkCreateOrConnectWithoutChartInputObjectSchema), z.lazy(() => SourceLinkCreateOrConnectWithoutChartInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => SourceLinkCreateManyChartInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => SourceLinkWhereUniqueInputObjectSchema), z.lazy(() => SourceLinkWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const SourceLinkUncheckedCreateNestedManyWithoutChartInputObjectSchema: z.ZodType<Prisma.SourceLinkUncheckedCreateNestedManyWithoutChartInput> = makeSchema() as unknown as z.ZodType<Prisma.SourceLinkUncheckedCreateNestedManyWithoutChartInput>;
export const SourceLinkUncheckedCreateNestedManyWithoutChartInputObjectZodSchema = makeSchema();
