import * as z from 'zod';
export const ChartFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  chart: z.string(),
  config: z.unknown().optional(),
  data: z.unknown().optional(),
  publish: z.boolean(),
  remoteUrl: z.string().optional(),
  isRemote: z.boolean(),
  preview: z.string().optional(),
  user: z.unknown(),
  userId: z.string(),
  slot: z.array(z.unknown()),
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