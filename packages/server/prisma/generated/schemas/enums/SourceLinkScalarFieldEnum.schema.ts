import * as z from 'zod';

export const SourceLinkScalarFieldEnumSchema = z.enum(['dataSourceId', 'chartId', 'config', 'createdAt', 'updatedAt'])

export type SourceLinkScalarFieldEnum = z.infer<typeof SourceLinkScalarFieldEnumSchema>;