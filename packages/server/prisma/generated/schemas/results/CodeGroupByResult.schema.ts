import * as z from 'zod';
export const CodeGroupByResultSchema = z.array(z.object({
  id: z.string(),
  code: z.string(),
  expire: z.number().int(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  _count: z.object({
    id: z.number(),
    code: z.number(),
    expire: z.number(),
    user: z.number(),
    userId: z.number(),
    createdAt: z.number(),
    updatedAt: z.number()
  }).optional(),
  _sum: z.object({
    expire: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    expire: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    code: z.string().nullable(),
    expire: z.number().int().nullable(),
    userId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    code: z.string().nullable(),
    expire: z.number().int().nullable(),
    userId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()
}));