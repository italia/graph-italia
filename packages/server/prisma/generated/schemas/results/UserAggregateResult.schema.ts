import * as z from 'zod';
export const UserAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    email: z.number(),
    password: z.number(),
    verifyed: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    Chart: z.number(),
    Dashboard: z.number(),
    DataSource: z.number(),
    Code: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    email: z.string().nullable(),
    password: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    email: z.string().nullable(),
    password: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()});