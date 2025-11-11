import * as z from 'zod';
export const ChartCreateManyResultSchema = z.object({
  count: z.number()
});