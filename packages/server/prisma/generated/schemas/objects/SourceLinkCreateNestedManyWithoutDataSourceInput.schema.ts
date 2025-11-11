import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SourceLinkCreateWithoutDataSourceInputObjectSchema as SourceLinkCreateWithoutDataSourceInputObjectSchema } from './SourceLinkCreateWithoutDataSourceInput.schema';
import { SourceLinkUncheckedCreateWithoutDataSourceInputObjectSchema as SourceLinkUncheckedCreateWithoutDataSourceInputObjectSchema } from './SourceLinkUncheckedCreateWithoutDataSourceInput.schema';
import { SourceLinkCreateOrConnectWithoutDataSourceInputObjectSchema as SourceLinkCreateOrConnectWithoutDataSourceInputObjectSchema } from './SourceLinkCreateOrConnectWithoutDataSourceInput.schema';
import { SourceLinkCreateManyDataSourceInputEnvelopeObjectSchema as SourceLinkCreateManyDataSourceInputEnvelopeObjectSchema } from './SourceLinkCreateManyDataSourceInputEnvelope.schema';
import { SourceLinkWhereUniqueInputObjectSchema as SourceLinkWhereUniqueInputObjectSchema } from './SourceLinkWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => SourceLinkCreateWithoutDataSourceInputObjectSchema), z.lazy(() => SourceLinkCreateWithoutDataSourceInputObjectSchema).array(), z.lazy(() => SourceLinkUncheckedCreateWithoutDataSourceInputObjectSchema), z.lazy(() => SourceLinkUncheckedCreateWithoutDataSourceInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => SourceLinkCreateOrConnectWithoutDataSourceInputObjectSchema), z.lazy(() => SourceLinkCreateOrConnectWithoutDataSourceInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => SourceLinkCreateManyDataSourceInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => SourceLinkWhereUniqueInputObjectSchema), z.lazy(() => SourceLinkWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const SourceLinkCreateNestedManyWithoutDataSourceInputObjectSchema: z.ZodType<Prisma.SourceLinkCreateNestedManyWithoutDataSourceInput> = makeSchema() as unknown as z.ZodType<Prisma.SourceLinkCreateNestedManyWithoutDataSourceInput>;
export const SourceLinkCreateNestedManyWithoutDataSourceInputObjectZodSchema = makeSchema();
