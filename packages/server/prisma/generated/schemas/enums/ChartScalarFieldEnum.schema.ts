import * as z from 'zod';

export const ChartScalarFieldEnumSchema = z.enum(['id', 'name', 'description', 'chart', 'config', 'data', 'publish', 'remoteUrl', 'isRemote', 'preview', 'userId', 'createdAt', 'updatedAt'])

export type ChartScalarFieldEnum = z.infer<typeof ChartScalarFieldEnumSchema>;