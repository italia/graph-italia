import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SourceLinkWhereUniqueInputObjectSchema as SourceLinkWhereUniqueInputObjectSchema } from './SourceLinkWhereUniqueInput.schema';
import { SourceLinkCreateWithoutDataSourceInputObjectSchema as SourceLinkCreateWithoutDataSourceInputObjectSchema } from './SourceLinkCreateWithoutDataSourceInput.schema';
import { SourceLinkUncheckedCreateWithoutDataSourceInputObjectSchema as SourceLinkUncheckedCreateWithoutDataSourceInputObjectSchema } from './SourceLinkUncheckedCreateWithoutDataSourceInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SourceLinkWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => SourceLinkCreateWithoutDataSourceInputObjectSchema), z.lazy(() => SourceLinkUncheckedCreateWithoutDataSourceInputObjectSchema)])
}).strict();
export const SourceLinkCreateOrConnectWithoutDataSourceInputObjectSchema: z.ZodType<Prisma.SourceLinkCreateOrConnectWithoutDataSourceInput> = makeSchema() as unknown as z.ZodType<Prisma.SourceLinkCreateOrConnectWithoutDataSourceInput>;
export const SourceLinkCreateOrConnectWithoutDataSourceInputObjectZodSchema = makeSchema();
