import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import * as bcrypt from 'bcrypt';
import * as z from 'zod';
import db from '../lib/db';
import {
  generateTokens,
  setAccessTokenCookie,
  clearAccessTokenCookie,
} from '../lib/jwt-hono';
import { sendActivationEmail, sendResetPasswordEmail } from '../lib/email';
import { checkAuth, requireUser } from '../lib/middlewares-hono';

const APP_URL = process.env.APP_URL || '/';

const router = new Hono();

// Apply auth check middleware to all routes
router.use('*', checkAuth);

router.get('/user', (c) => {
  console.log('check user');
  try {
    const user = c.get('user') || null;
    if (!user) {
      return c.json(null, 401);
    }
    console.log('user found', user);
    const token = c.get('token') || null;
    return c.json({ ...user, token }, 201);
  } catch (error) {
    console.log('Auth user ERROR', error);
    return c.json({ error: 'Internal error' }, 500);
  }
});

const registerSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email or password'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(7, 'Password must be at least 7 characters long'),
});

router.post('/register', zValidator('json', registerSchema), async (c) => {
  try {
    const { email, password } = c.req.valid('json');
    if (!email || !password) {
      return c.json({
        error: { message: 'You must provide an email and a password.' },
      }, 400);
    }
    const existingUser = await db.findUserByEmail(email);
    if (existingUser) {
      return c.json({ error: { message: 'Email already in use.' } }, 409);
    }
    const user = await db.createUserByEmailAndPassword({ email, password });
    const pin = await db.createCode(user.id);
    console.log('pin', pin);
    await sendActivationEmail(user, pin);

    return c.json({ auth: true }, 200);
  } catch (err) {
    console.error('Register error:', err);
    return c.json({ error: { message: 'Registration failed' } }, 500);
  }
});

const loginSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email or password'),
  password: z.string({ required_error: 'Password is required' }),
});

router.post('/login', zValidator('json', loginSchema), async (c) => {
  console.log('login');
  try {
    const { email, password } = c.req.valid('json');
    const existingUser = await db.findUserByEmail(email);
    if (!existingUser) {
      return c.json({ error: { message: 'Invalid login credentials.' } }, 401);
    }
    const validPassword = await bcrypt.compare(password, existingUser.password);
    if (!validPassword) {
      return c.json({ error: { message: 'Invalid login credentials.' } }, 401);
    }
    const { accessToken } = generateTokens(existingUser);
    setAccessTokenCookie(c, accessToken);
    return c.json({ auth: true });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: { message: 'Login failed' } }, 500);
  }
});

const recoverSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email or password'),
});

router.post('/recover', zValidator('json', recoverSchema), async (c) => {
  clearAccessTokenCookie(c);
  const { email } = c.req.valid('json');
  console.log('recover', email);
  const user = await db.findUserByEmail(email);
  if (user) {
    console.log('user', user);
    const pin = await db.createCode(user.id);
    console.log('pin', pin);
    await sendResetPasswordEmail(user, pin);
  }
  return c.json(true, 200);
});

router.get('/logout', (c) => {
  console.log('logout, bye');
  clearAccessTokenCookie(c);
  console.log('removed cookies, return');
  return c.json(true, 200);
});

const verifySchema = z.object({
  uid: z.string({
    required_error: 'uid is required',
  }),
  code: z.string({ required_error: 'code is required' }),
});

router.post('/verify', zValidator('json', verifySchema), async (c) => {
  const { uid, code } = c.req.valid('json');
  console.log('uid:', uid, ', code:', code);
  if (!uid || !code) {
    return c.json({ error: 'Invalid user activation.' }, 401);
  }
  const user = c.get('user') as any;
  if (user) {
    console.log('req.user?', user);
    if (user.id !== uid) {
      return c.json({ error: 'Invalid user activation.' }, 400);
    }
  }
  const dbUser = await db.findUserById(uid);
  console.log('user?', dbUser);
  if (!dbUser) {
    return c.json({ error: 'User not found.' }, 400);
  }
  const pin = await db.findCodeByUid(uid);
  console.log('pin?', pin);
  if (!pin) {
    console.log('pin not found');
    return c.json({ error: 'Code invalid or expired.' }, 400);
  }
  if (`${pin}`.trim() != `${code}`.trim()) {
    console.log('pin are not equals', pin, code);
    return c.json({ error: 'Code invalid or expired.' }, 400);
  }
  console.log('user verifyed');
  const userValue = await db.setVerifyed(dbUser.id);

  await db.destroyCodes(dbUser.id);

  console.log('login user');
  const { accessToken } = generateTokens(userValue);
  setAccessTokenCookie(c, accessToken);
  return c.json({ auth: true });
});

const confirmSchema = z.object({
  uid: z.string({
    required_error: 'uid is required',
  }),
  code: z.string({ required_error: 'code is required' }),
});

router.get('/confirm/:uid/:code', zValidator('param', confirmSchema), async (c) => {
  const { uid, code } = c.req.valid('param');
  console.log('uid:', uid, ', code:', code);
  if (!uid || !code) {
    return c.json({ error: 'Invalid confirmation' }, 401);
  }
  const user = c.get('user') as any;
  if (user) {
    console.log('req.user?', user);
    if (user.userId !== uid) {
      return c.json({ error: 'Invalid user activation.' }, 400);
    }
  }
  const dbUser = await db.findUserById(uid);
  console.log('user?', dbUser);
  if (!dbUser) {
    return c.json({ error: 'User not found.' }, 400);
  }
  const pin = await db.findCodeByUid(uid);
  console.log('pin?', pin);
  if (!pin || pin !== code) {
    return c.json({ error: 'Code invalid or expired.' }, 400);
  }
  const userValue = await db.setVerifyed(dbUser.id);
  await db.destroyCodes(dbUser.id);
  const { accessToken } = generateTokens(userValue);
  setAccessTokenCookie(c, accessToken);
  console.log('validate code end');
  return c.redirect(APP_URL);
});

const passwordSchema = z
  .string({ required_error: 'Password is required' })
  .min(8, { message: 'Password must be at least 8 characters long' })
  .refine((password) => /[A-Z]/.test(password), {
    message: 'Password must have at least one uppercase letter',
  })
  .refine((password) => /[a-z]/.test(password), {
    message: 'Password must have at least one lowercase letter',
  })
  .refine((password) => /[0-9]/.test(password), {
    message: 'Must contain a number',
  })
  .refine((password) => /[!@#$%^&*]/.test(password), {
    message: 'Must contain at least one special character',
  });

const changePwdSchema = z.object({
  password: passwordSchema,
});

router.put('/pwd', requireUser, zValidator('json', changePwdSchema), async (c) => {
  const user = c.get('user') as any;
  console.log('user', user);
  const { password } = c.req.valid('json');
  console.log('password', password);
  if (!user || !password) {
    return c.json({ error: 'User and password are required.' }, 400);
  }
  await db.changePassword(user.userId, password);
  return c.body(null, 204);
});

export default router;
