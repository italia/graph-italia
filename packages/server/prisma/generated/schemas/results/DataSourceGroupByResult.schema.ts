import * as z from 'zod';
export const DataSourceGroupByResultSchema = z.array(z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  data: z.unknown(),
  rules: z.unknown(),
  publish: z.boolean(),
  isTrasposed: z.boolean(),
  remoteUrl: z.string(),
  isRemote: z.boolean(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  _count: z.object({
    id: z.number(),
    name: z.number(),
    description: z.number(),
    data: z.number(),
    rules: z.number(),
    publish: z.number(),
    isTrasposed: z.number(),
    remoteUrl: z.number(),
    isRemote: z.number(),
    user: z.number(),
    userId: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    SourceLink: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    description: z.string().nullable(),
    remoteUrl: z.string().nullable(),
    userId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    description: z.string().nullable(),
    remoteUrl: z.string().nullable(),
    userId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()
}));