import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SourceLinkScalarWhereInputObjectSchema as SourceLinkScalarWhereInputObjectSchema } from './SourceLinkScalarWhereInput.schema';
import { SourceLinkUpdateManyMutationInputObjectSchema as SourceLinkUpdateManyMutationInputObjectSchema } from './SourceLinkUpdateManyMutationInput.schema';
import { SourceLinkUncheckedUpdateManyWithoutDataSourceInputObjectSchema as SourceLinkUncheckedUpdateManyWithoutDataSourceInputObjectSchema } from './SourceLinkUncheckedUpdateManyWithoutDataSourceInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SourceLinkScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => SourceLinkUpdateManyMutationInputObjectSchema), z.lazy(() => SourceLinkUncheckedUpdateManyWithoutDataSourceInputObjectSchema)])
}).strict();
export const SourceLinkUpdateManyWithWhereWithoutDataSourceInputObjectSchema: z.ZodType<Prisma.SourceLinkUpdateManyWithWhereWithoutDataSourceInput> = makeSchema() as unknown as z.ZodType<Prisma.SourceLinkUpdateManyWithWhereWithoutDataSourceInput>;
export const SourceLinkUpdateManyWithWhereWithoutDataSourceInputObjectZodSchema = makeSchema();
