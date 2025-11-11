import * as z from 'zod';
export const CodeCreateManyResultSchema = z.object({
  count: z.number()
});