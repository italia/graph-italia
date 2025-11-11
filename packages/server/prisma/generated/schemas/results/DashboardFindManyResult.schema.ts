import * as z from 'zod';
export const DashboardFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  publish: z.boolean(),
  user: z.unknown(),
  userId: z.string(),
  slots: z.array(z.unknown()),
  createdAt: z.date(),
  updatedAt: z.date()
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