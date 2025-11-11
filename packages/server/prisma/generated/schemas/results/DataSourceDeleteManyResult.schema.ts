import * as z from 'zod';
export const DataSourceDeleteManyResultSchema = z.object({
  count: z.number()
});