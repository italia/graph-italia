import { Hono } from 'hono';
import * as ai from '../lib/ai';
import { checkAuth, requireUser } from '../lib/middlewares';
import { logger } from '../lib/logger';
import * as z from "zod";
import {
  validator as zValidator,
  resolver,
  describeRoute,
} from "hono-openapi";

const router = new Hono();

// Apply auth check middleware to all routes
router.use('*', checkAuth);

const errorMessageSchema = z.object({
  error: z.string(),
});

const hintsListSchema = z.array(z.object({
  hint: z.string(),
  confidence: z.number().min(0).max(1),
}));

router.post('/', describeRoute({
  responses: {
    200: {
      description: "Successful response",
      content: {
        "application/json": {
          schema: resolver(hintsListSchema),
        },
      },
    },
    500: {
      description: "Internal error",
      content: {
        "application/json": {
          schema: resolver(errorMessageSchema),
        },
      },
    }
  }
}), requireUser, async (c) => {
  try {
    const body = await c.req.json();
    const results = await ai.getSuggestions(body);
    return c.json(results);
  } catch (err) {
    logger.error('AI hints error', err instanceof Error ? err : undefined);
    return c.json({ error: 'Internal error' }, 500);
  }
});

export default router;
