import * as z from 'zod';
export const ChartUpsertResultSchema = z.object({
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
});