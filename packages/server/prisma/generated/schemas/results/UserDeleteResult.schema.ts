import * as z from 'zod';
export const UserDeleteResultSchema = z.nullable(z.object({
  id: z.string(),
  email: z.string(),
  password: z.string(),
  verifyed: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  Chart: z.array(z.unknown()),
  Dashboard: z.array(z.unknown()),
  DataSource: z.array(z.unknown()),
  Code: z.array(z.unknown())
}));