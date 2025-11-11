import * as z from 'zod';
export const DataSourceCreateManyResultSchema = z.object({
  count: z.number()
});