import * as z from 'zod';
import type { ApiKeyModel } from './lib/db/prisma/models/ApiKey';

export const paramsWithIdSchema = z.object({
  id: z.string().min(1, 'Invalid id'),
});

export type ParamsWithId = z.infer<typeof paramsWithIdSchema>;

export interface ErrorResponse {
  error: {
    stack?: string;
    message: string;
  };
}

export interface ServerResponse {
  data?: any;
  error?: ErrorResponse;
}

export interface RequestValidators {
  params?: z.AnyZodObject;
  body?: z.AnyZodObject;
  query?: z.AnyZodObject;
}

export interface TokensResponseInterface {
  access_token: string;
  refresh_token?: string;
}

export interface ParsedToken {
  exp: number;
  userId: string;
  name: string;
}

/** Shared Hono context variables for routes that support both user and API key auth. */
export type AppVariables = {
  user: ParsedToken | null;
  token: string | undefined;
  apiKey: ApiKeyModel | null;
  projectId: string | null;
};
