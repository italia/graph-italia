import * as z from 'zod';
export const DashboardUpdateResultSchema = z.nullable(z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  publish: z.boolean(),
  user: z.unknown(),
  userId: z.string(),
  slots: z.array(z.unknown()),
  createdAt: z.date(),
  updatedAt: z.date()
}));