import { getCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { verifyAccessToken } from './jwt';
import { logger } from './logger';

// Middleware to check authentication and attach user to context
export const checkAuth = createMiddleware(async (c, next) => {
  let accessToken;
  try {
    // Try cookie first
    accessToken = getCookie(c, 'access_token');
    
    // Fallback to Bearer token
    if (!accessToken) {
      const authHeader = c.req.header('Authorization') || '';
      accessToken = authHeader.replace(/^Bearer\s/, '');
    }

    if (accessToken) {
      const payload = verifyAccessToken(accessToken) as any;
      c.set('user', payload);
      c.set('token', accessToken);
    }
    await next();
  } catch (error) {
    logger.warn('Auth failed', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      path: c.req.path 
    });
    c.set('user', null);
    throw new HTTPException(401, { message: 'Unauthorized' });
  }
});

// Middleware to require authenticated user
export const requireUser = createMiddleware(async (c, next) => {
  try {
    const user = c.get('user');
    if (!user) {
      throw new HTTPException(401, { message: 'Unauthorized.' });
    }
    await next();
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(401, { message: 'Unauthorized.' });
  }
});
