import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import * as z from 'zod';
import { checkAuth, requireUser } from '../lib/middlewares-hono';
import type { ParsedToken } from '../types';
import db from '../lib/db';

const router = new Hono();

// Apply auth check middleware to all routes
router.use('*', checkAuth);

const detailSchema = z.object({
  id: z.string({
    required_error: 'Id is required',
  }),
});

const slotSchema = z.object({
  chartId: z.string(),
  settings: z.object({}).passthrough().optional(),
  createdAt: z.coerce.date().default(() => new Date()),
  updatedAt: z.coerce.date().default(() => new Date()),
});

const createDashboardSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  config: z.unknown().optional(),
  data: z.unknown().optional(),
  remoteUrl: z.string().nullable().optional(),
  isRemote: z.boolean().optional(),
  publish: z.boolean().optional(),
  preview: z.string().nullable().optional(),
});

const updateDashboardSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  config: z.unknown().optional(),
  data: z.unknown().optional(),
  publish: z.boolean().optional(),
  remoteUrl: z.string().nullable().optional(),
  isRemote: z.boolean().optional(),
  id: z.string().optional(),
  preview: z.string().nullable().optional(),
  slots: z.array(slotSchema).optional(),
});

const updateSlotsSchema = z.object({
  slots: z.array(slotSchema),
});

/** Index */
router.get('/', async (c) => {
  try {
    const user = c.get('user') as ParsedToken | null;
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    const id = user.userId;
    const results = await db.findDashboardByUserId(id);
    return c.json(results);
  } catch (err) {
    console.error('Dashboard index error:', err);
    return c.json({ error: 'Internal error' }, 500);
  }
});

/** Get :ID */
router.get('/:id', requireUser, zValidator('param', detailSchema), async (c) => {
  try {
    const { id } = c.req.valid('param');
    const result = await db.findDashboardByIdWithIncludes(id);
    return c.json(result);
  } catch (err) {
    console.error('Dashboard get error:', err);
    return c.json({ error: 'Internal error' }, 500);
  }
});

/** Create */
router.post('/', requireUser, zValidator('json', createDashboardSchema), async (c) => {
  try {
    const user = c.get('user') as ParsedToken;
    const body = c.req.valid('json');
    const chartData = {
      userId: user.userId,
      ...body,
    };
    console.log(chartData);
    const result = await db.dashboardDb.create(chartData);
    return c.json(result, 201);
  } catch (err) {
    console.error('Dashboard create error:', err);
    return c.json({ error: 'Internal error' }, 500);
  }
});

/** Delete ID */
router.delete('/:id', requireUser, zValidator('param', detailSchema), async (c) => {
  try {
    const user = c.get('user') as ParsedToken;
    const { id: dashboardId } = c.req.valid('param');
    const dashboard = await db.dashboardDb.findById(dashboardId);
    if (!dashboard) {
      return c.json({ message: 'Not Found' }, 404);
    }
    if (dashboard.userId !== user.userId) {
      return c.json({ message: 'Not Authorized' }, 401);
    }
    await db.deleteDashboardById(dashboardId);
    return c.body(null, 204);
  } catch (err) {
    console.error('Dashboard delete error:', err);
    return c.json({ error: 'Internal error' }, 500);
  }
});

/** Update slots */
router.put(
  '/:id/slots',
  requireUser,
  zValidator('param', detailSchema),
  zValidator('json', updateSlotsSchema),
  async (c) => {
    try {
      const user = c.get('user') as ParsedToken;
      const { id: dashboardId } = c.req.valid('param');
      const dashboardData = c.req.valid('json');
      
      const dashboard = await db.findSlots(dashboardId);
      if (!dashboard) {
        return c.json({ message: 'Not Found' }, 404);
      }
      if (dashboard.userId !== user.userId) {
        return c.json({ message: 'Not Authorized' }, 401);
      }
      console.log('Updating dashboard', dashboardId);
      console.log('Updating dashboard', JSON.stringify(dashboard));
      console.log('Dashboard Data', dashboardData);
      
      const { slots: storedSlots } = dashboard;
      const { slots: updatedSlots } = dashboardData;
      const { toCreate, toUpdate, toDelete } = db.separateCreateUpdateDeleteSlots(
        storedSlots,
        updatedSlots,
        (s) => s.chartId
      );

      console.log(toCreate, toUpdate);

      const result = await db.updateSlots(dashboardId, {
        toCreate,
        toUpdate,
        toDelete,
      });
      return c.json(result);
    } catch (err) {
      console.error('Dashboard update slots error:', err);
      return c.json({ error: 'Internal error' }, 500);
    }
  }
);

/** Update ID */
router.put(
  '/:id',
  requireUser,
  zValidator('param', detailSchema),
  zValidator('json', updateDashboardSchema),
  async (c) => {
    try {
      const user = c.get('user') as ParsedToken;
      const { id: dashboardId } = c.req.valid('param');
      const dashboardData = c.req.valid('json');
      
      const dashboard = await db.dashboardDb.findById(dashboardId);
      if (!dashboard) {
        return c.json({ message: 'Not Found' }, 404);
      }
      if (dashboard.userId !== user.userId) {
        return c.json({ message: 'Not Authorized' }, 401);
      }
      console.log('Updating dashboard', dashboardId);
      console.log('Dashboard Data', dashboardData);
      const result = await db.dashboardDb.update(dashboardId, dashboardData);
      return c.json(result);
    } catch (err) {
      console.error('Dashboard update error:', err);
      return c.json({ error: 'Internal error' }, 500);
    }
  }
);

export default router;
