import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserArgsObjectSchema as UserArgsObjectSchema } from './UserArgs.schema';
import { SourceLinkFindManySchema as SourceLinkFindManySchema } from '../findManySourceLink.schema';
import { DataSourceCountOutputTypeArgsObjectSchema as DataSourceCountOutputTypeArgsObjectSchema } from './DataSourceCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  user: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  SourceLink: z.union([z.boolean(), z.lazy(() => SourceLinkFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => DataSourceCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const DataSourceIncludeObjectSchema: z.ZodType<Prisma.DataSourceInclude> = makeSchema() as unknown as z.ZodType<Prisma.DataSourceInclude>;
export const DataSourceIncludeObjectZodSchema = makeSchema();
