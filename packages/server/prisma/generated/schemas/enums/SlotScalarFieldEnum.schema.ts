import * as z from 'zod';

export const SlotScalarFieldEnumSchema = z.enum(['dashboardId', 'chartId', 'settings', 'name', 'description', 'createdAt', 'updatedAt'])

export type SlotScalarFieldEnum = z.infer<typeof SlotScalarFieldEnumSchema>;