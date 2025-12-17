import { getCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { verifyAccessToken } from './jwt';
import type { Context, Next } from 'hono';

// Middleware to check authentication and attach user to context
export const checkAuth = createMiddleware(async (c, next) => {
  console.log('checkAuth');
  let accessToken;
  try {
    console.log('checkAuthCookie');
    accessToken = getCookie(c, 'access_token');
    
    if (!accessToken) {
      console.log('checkAuthBearer');
      const authHeader = c.req.header('Authorization') || '';
      accessToken = authHeader.replace(/^Bearer\s/, '');
    }

    if (accessToken) {
      console.log('ACCESS TOKEN', accessToken);
      const payload = verifyAccessToken(accessToken) as any;
      console.log('USER', payload);
      c.set('user', payload);
      c.set('token', accessToken);
    }
    await next();
  } catch (error) {
    console.error('checkAuth ERROR', error);
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
    console.log('user is ok');
    await next();
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(401, { message: 'Unauthorized.' });
  }
});

