import * as z from 'zod';
export const ChartDeleteManyResultSchema = z.object({
  count: z.number()
});