import * as z from 'zod';
export const ChartAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    name: z.number(),
    description: z.number(),
    chart: z.number(),
    config: z.number(),
    data: z.number(),
    publish: z.number(),
    remoteUrl: z.number(),
    isRemote: z.number(),
    preview: z.number(),
    user: z.number(),
    userId: z.number(),
    slot: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    SourceLink: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    description: z.string().nullable(),
    chart: z.string().nullable(),
    remoteUrl: z.string().nullable(),
    preview: z.string().nullable(),
    userId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    description: z.string().nullable(),
    chart: z.string().nullable(),
    remoteUrl: z.string().nullable(),
    preview: z.string().nullable(),
    userId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()});