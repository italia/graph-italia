import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserArgsObjectSchema as UserArgsObjectSchema } from './UserArgs.schema';
import { SourceLinkFindManySchema as SourceLinkFindManySchema } from '../findManySourceLink.schema';
import { DataSourceCountOutputTypeArgsObjectSchema as DataSourceCountOutputTypeArgsObjectSchema } from './DataSourceCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  data: z.boolean().optional(),
  rules: z.boolean().optional(),
  publish: z.boolean().optional(),
  isTrasposed: z.boolean().optional(),
  remoteUrl: z.boolean().optional(),
  isRemote: z.boolean().optional(),
  user: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  userId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  SourceLink: z.union([z.boolean(), z.lazy(() => SourceLinkFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => DataSourceCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const DataSourceSelectObjectSchema: z.ZodType<Prisma.DataSourceSelect> = makeSchema() as unknown as z.ZodType<Prisma.DataSourceSelect>;
export const DataSourceSelectObjectZodSchema = makeSchema();
