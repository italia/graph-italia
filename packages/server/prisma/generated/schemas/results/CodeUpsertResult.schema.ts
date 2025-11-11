import * as z from 'zod';
export const CodeUpsertResultSchema = z.object({
  id: z.string(),
  code: z.string(),
  expire: z.number().int(),
  user: z.unknown(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});