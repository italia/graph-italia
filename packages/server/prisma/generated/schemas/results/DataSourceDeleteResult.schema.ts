import * as z from 'zod';
export const DataSourceDeleteResultSchema = z.nullable(z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  data: z.unknown(),
  rules: z.unknown().optional(),
  publish: z.boolean(),
  isTrasposed: z.boolean(),
  remoteUrl: z.string().optional(),
  isRemote: z.boolean(),
  user: z.unknown(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  SourceLink: z.array(z.unknown())
}));