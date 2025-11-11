import * as z from 'zod';

export const DashboardScalarFieldEnumSchema = z.enum(['id', 'name', 'description', 'publish', 'userId', 'createdAt', 'updatedAt'])

export type DashboardScalarFieldEnum = z.infer<typeof DashboardScalarFieldEnumSchema>;