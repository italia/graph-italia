import * as z from 'zod';
export const UserFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  email: z.string(),
  password: z.string(),
  verifyed: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  Chart: z.array(z.unknown()),
  Dashboard: z.array(z.unknown()),
  DataSource: z.array(z.unknown()),
  Code: z.array(z.unknown())
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