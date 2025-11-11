import * as z from 'zod';

export const DataSourceScalarFieldEnumSchema = z.enum(['id', 'name', 'description', 'data', 'rules', 'publish', 'isTrasposed', 'remoteUrl', 'isRemote', 'userId', 'createdAt', 'updatedAt'])

export type DataSourceScalarFieldEnum = z.infer<typeof DataSourceScalarFieldEnumSchema>;