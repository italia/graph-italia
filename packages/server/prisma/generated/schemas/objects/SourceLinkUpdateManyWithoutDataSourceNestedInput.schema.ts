import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SourceLinkCreateWithoutDataSourceInputObjectSchema as SourceLinkCreateWithoutDataSourceInputObjectSchema } from './SourceLinkCreateWithoutDataSourceInput.schema';
import { SourceLinkUncheckedCreateWithoutDataSourceInputObjectSchema as SourceLinkUncheckedCreateWithoutDataSourceInputObjectSchema } from './SourceLinkUncheckedCreateWithoutDataSourceInput.schema';
import { SourceLinkCreateOrConnectWithoutDataSourceInputObjectSchema as SourceLinkCreateOrConnectWithoutDataSourceInputObjectSchema } from './SourceLinkCreateOrConnectWithoutDataSourceInput.schema';
import { SourceLinkUpsertWithWhereUniqueWithoutDataSourceInputObjectSchema as SourceLinkUpsertWithWhereUniqueWithoutDataSourceInputObjectSchema } from './SourceLinkUpsertWithWhereUniqueWithoutDataSourceInput.schema';
import { SourceLinkCreateManyDataSourceInputEnvelopeObjectSchema as SourceLinkCreateManyDataSourceInputEnvelopeObjectSchema } from './SourceLinkCreateManyDataSourceInputEnvelope.schema';
import { SourceLinkWhereUniqueInputObjectSchema as SourceLinkWhereUniqueInputObjectSchema } from './SourceLinkWhereUniqueInput.schema';
import { SourceLinkUpdateWithWhereUniqueWithoutDataSourceInputObjectSchema as SourceLinkUpdateWithWhereUniqueWithoutDataSourceInputObjectSchema } from './SourceLinkUpdateWithWhereUniqueWithoutDataSourceInput.schema';
import { SourceLinkUpdateManyWithWhereWithoutDataSourceInputObjectSchema as SourceLinkUpdateManyWithWhereWithoutDataSourceInputObjectSchema } from './SourceLinkUpdateManyWithWhereWithoutDataSourceInput.schema';
import { SourceLinkScalarWhereInputObjectSchema as SourceLinkScalarWhereInputObjectSchema } from './SourceLinkScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => SourceLinkCreateWithoutDataSourceInputObjectSchema), z.lazy(() => SourceLinkCreateWithoutDataSourceInputObjectSchema).array(), z.lazy(() => SourceLinkUncheckedCreateWithoutDataSourceInputObjectSchema), z.lazy(() => SourceLinkUncheckedCreateWithoutDataSourceInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => SourceLinkCreateOrConnectWithoutDataSourceInputObjectSchema), z.lazy(() => SourceLinkCreateOrConnectWithoutDataSourceInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => SourceLinkUpsertWithWhereUniqueWithoutDataSourceInputObjectSchema), z.lazy(() => SourceLinkUpsertWithWhereUniqueWithoutDataSourceInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => SourceLinkCreateManyDataSourceInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => SourceLinkWhereUniqueInputObjectSchema), z.lazy(() => SourceLinkWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => SourceLinkWhereUniqueInputObjectSchema), z.lazy(() => SourceLinkWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => SourceLinkWhereUniqueInputObjectSchema), z.lazy(() => SourceLinkWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => SourceLinkWhereUniqueInputObjectSchema), z.lazy(() => SourceLinkWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => SourceLinkUpdateWithWhereUniqueWithoutDataSourceInputObjectSchema), z.lazy(() => SourceLinkUpdateWithWhereUniqueWithoutDataSourceInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => SourceLinkUpdateManyWithWhereWithoutDataSourceInputObjectSchema), z.lazy(() => SourceLinkUpdateManyWithWhereWithoutDataSourceInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => SourceLinkScalarWhereInputObjectSchema), z.lazy(() => SourceLinkScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const SourceLinkUpdateManyWithoutDataSourceNestedInputObjectSchema: z.ZodType<Prisma.SourceLinkUpdateManyWithoutDataSourceNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.SourceLinkUpdateManyWithoutDataSourceNestedInput>;
export const SourceLinkUpdateManyWithoutDataSourceNestedInputObjectZodSchema = makeSchema();
