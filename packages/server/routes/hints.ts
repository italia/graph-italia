import { Hono } from 'hono';
import * as ai from '../lib/ai';
import { checkAuth, requireUser } from '../lib/middlewares-hono';
import { logger } from '../lib/logger';

const router = new Hono();

// Apply auth check middleware to all routes
router.use('*', checkAuth);

router.post('/', requireUser, async (c) => {
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
