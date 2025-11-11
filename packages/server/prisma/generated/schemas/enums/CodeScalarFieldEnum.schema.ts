import * as z from 'zod';

export const CodeScalarFieldEnumSchema = z.enum(['id', 'code', 'expire', 'userId', 'createdAt', 'updatedAt'])

export type CodeScalarFieldEnum = z.infer<typeof CodeScalarFieldEnumSchema>;