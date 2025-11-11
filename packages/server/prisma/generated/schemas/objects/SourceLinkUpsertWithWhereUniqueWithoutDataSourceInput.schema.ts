import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SourceLinkWhereUniqueInputObjectSchema as SourceLinkWhereUniqueInputObjectSchema } from './SourceLinkWhereUniqueInput.schema';
import { SourceLinkUpdateWithoutDataSourceInputObjectSchema as SourceLinkUpdateWithoutDataSourceInputObjectSchema } from './SourceLinkUpdateWithoutDataSourceInput.schema';
import { SourceLinkUncheckedUpdateWithoutDataSourceInputObjectSchema as SourceLinkUncheckedUpdateWithoutDataSourceInputObjectSchema } from './SourceLinkUncheckedUpdateWithoutDataSourceInput.schema';
import { SourceLinkCreateWithoutDataSourceInputObjectSchema as SourceLinkCreateWithoutDataSourceInputObjectSchema } from './SourceLinkCreateWithoutDataSourceInput.schema';
import { SourceLinkUncheckedCreateWithoutDataSourceInputObjectSchema as SourceLinkUncheckedCreateWithoutDataSourceInputObjectSchema } from './SourceLinkUncheckedCreateWithoutDataSourceInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SourceLinkWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => SourceLinkUpdateWithoutDataSourceInputObjectSchema), z.lazy(() => SourceLinkUncheckedUpdateWithoutDataSourceInputObjectSchema)]),
  create: z.union([z.lazy(() => SourceLinkCreateWithoutDataSourceInputObjectSchema), z.lazy(() => SourceLinkUncheckedCreateWithoutDataSourceInputObjectSchema)])
}).strict();
export const SourceLinkUpsertWithWhereUniqueWithoutDataSourceInputObjectSchema: z.ZodType<Prisma.SourceLinkUpsertWithWhereUniqueWithoutDataSourceInput> = makeSchema() as unknown as z.ZodType<Prisma.SourceLinkUpsertWithWhereUniqueWithoutDataSourceInput>;
export const SourceLinkUpsertWithWhereUniqueWithoutDataSourceInputObjectZodSchema = makeSchema();
