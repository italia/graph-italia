import * as z from 'zod';

// prettier-ignore
export const CodeInputSchema = z.object({
    id: z.string(),
    code: z.string(),
    expire: z.number().int(),
    user: z.unknown(),
    userId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type CodeInputType = z.infer<typeof CodeInputSchema>;
