import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SourceLinkCreateWithoutChartInputObjectSchema as SourceLinkCreateWithoutChartInputObjectSchema } from './SourceLinkCreateWithoutChartInput.schema';
import { SourceLinkUncheckedCreateWithoutChartInputObjectSchema as SourceLinkUncheckedCreateWithoutChartInputObjectSchema } from './SourceLinkUncheckedCreateWithoutChartInput.schema';
import { SourceLinkCreateOrConnectWithoutChartInputObjectSchema as SourceLinkCreateOrConnectWithoutChartInputObjectSchema } from './SourceLinkCreateOrConnectWithoutChartInput.schema';
import { SourceLinkUpsertWithWhereUniqueWithoutChartInputObjectSchema as SourceLinkUpsertWithWhereUniqueWithoutChartInputObjectSchema } from './SourceLinkUpsertWithWhereUniqueWithoutChartInput.schema';
import { SourceLinkCreateManyChartInputEnvelopeObjectSchema as SourceLinkCreateManyChartInputEnvelopeObjectSchema } from './SourceLinkCreateManyChartInputEnvelope.schema';
import { SourceLinkWhereUniqueInputObjectSchema as SourceLinkWhereUniqueInputObjectSchema } from './SourceLinkWhereUniqueInput.schema';
import { SourceLinkUpdateWithWhereUniqueWithoutChartInputObjectSchema as SourceLinkUpdateWithWhereUniqueWithoutChartInputObjectSchema } from './SourceLinkUpdateWithWhereUniqueWithoutChartInput.schema';
import { SourceLinkUpdateManyWithWhereWithoutChartInputObjectSchema as SourceLinkUpdateManyWithWhereWithoutChartInputObjectSchema } from './SourceLinkUpdateManyWithWhereWithoutChartInput.schema';
import { SourceLinkScalarWhereInputObjectSchema as SourceLinkScalarWhereInputObjectSchema } from './SourceLinkScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => SourceLinkCreateWithoutChartInputObjectSchema), z.lazy(() => SourceLinkCreateWithoutChartInputObjectSchema).array(), z.lazy(() => SourceLinkUncheckedCreateWithoutChartInputObjectSchema), z.lazy(() => SourceLinkUncheckedCreateWithoutChartInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => SourceLinkCreateOrConnectWithoutChartInputObjectSchema), z.lazy(() => SourceLinkCreateOrConnectWithoutChartInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => SourceLinkUpsertWithWhereUniqueWithoutChartInputObjectSchema), z.lazy(() => SourceLinkUpsertWithWhereUniqueWithoutChartInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => SourceLinkCreateManyChartInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => SourceLinkWhereUniqueInputObjectSchema), z.lazy(() => SourceLinkWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => SourceLinkWhereUniqueInputObjectSchema), z.lazy(() => SourceLinkWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => SourceLinkWhereUniqueInputObjectSchema), z.lazy(() => SourceLinkWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => SourceLinkWhereUniqueInputObjectSchema), z.lazy(() => SourceLinkWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => SourceLinkUpdateWithWhereUniqueWithoutChartInputObjectSchema), z.lazy(() => SourceLinkUpdateWithWhereUniqueWithoutChartInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => SourceLinkUpdateManyWithWhereWithoutChartInputObjectSchema), z.lazy(() => SourceLinkUpdateManyWithWhereWithoutChartInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => SourceLinkScalarWhereInputObjectSchema), z.lazy(() => SourceLinkScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const SourceLinkUpdateManyWithoutChartNestedInputObjectSchema: z.ZodType<Prisma.SourceLinkUpdateManyWithoutChartNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.SourceLinkUpdateManyWithoutChartNestedInput>;
export const SourceLinkUpdateManyWithoutChartNestedInputObjectZodSchema = makeSchema();
