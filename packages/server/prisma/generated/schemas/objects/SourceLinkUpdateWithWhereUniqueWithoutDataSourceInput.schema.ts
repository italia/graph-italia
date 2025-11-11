import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SourceLinkWhereUniqueInputObjectSchema as SourceLinkWhereUniqueInputObjectSchema } from './SourceLinkWhereUniqueInput.schema';
import { SourceLinkUpdateWithoutDataSourceInputObjectSchema as SourceLinkUpdateWithoutDataSourceInputObjectSchema } from './SourceLinkUpdateWithoutDataSourceInput.schema';
import { SourceLinkUncheckedUpdateWithoutDataSourceInputObjectSchema as SourceLinkUncheckedUpdateWithoutDataSourceInputObjectSchema } from './SourceLinkUncheckedUpdateWithoutDataSourceInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SourceLinkWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => SourceLinkUpdateWithoutDataSourceInputObjectSchema), z.lazy(() => SourceLinkUncheckedUpdateWithoutDataSourceInputObjectSchema)])
}).strict();
export const SourceLinkUpdateWithWhereUniqueWithoutDataSourceInputObjectSchema: z.ZodType<Prisma.SourceLinkUpdateWithWhereUniqueWithoutDataSourceInput> = makeSchema() as unknown as z.ZodType<Prisma.SourceLinkUpdateWithWhereUniqueWithoutDataSourceInput>;
export const SourceLinkUpdateWithWhereUniqueWithoutDataSourceInputObjectZodSchema = makeSchema();
