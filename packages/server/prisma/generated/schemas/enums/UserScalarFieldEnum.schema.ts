import * as z from 'zod';

export const UserScalarFieldEnumSchema = z.enum(['id', 'email', 'password', 'verifyed', 'createdAt', 'updatedAt'])

export type UserScalarFieldEnum = z.infer<typeof UserScalarFieldEnumSchema>;