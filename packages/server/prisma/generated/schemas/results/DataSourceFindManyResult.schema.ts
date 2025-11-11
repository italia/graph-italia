import * as z from 'zod';
export const DataSourceFindManyResultSchema = z.object({
  data: z.array(z.object({
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
})),
  pagination: z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  hasNext: z.boolean(),
  hasPrev: z.boolean()
})
});