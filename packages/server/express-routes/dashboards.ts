import { Router } from 'express';
import * as z from 'zod';
import { requireUser, validateRequest } from '../lib/middlewares';
import type { ParsedToken } from '../types';
import db from '../lib/db';

const router = Router();

const detailSchema = z.object({
  id: z.string({
    required_error: 'Id is required',
  }),
});

const slotSchema = z.object({
  chartId: z.string(), // Ignoriamo la validazione specifica per Chart
  settings: z.object({}).passthrough().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
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
  // chart: z.string().optional(),
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
router.get('/', async (req: any, res, next) => {
  try {
    const user: ParsedToken = req.user;
    if (!user) return;
    const id = user.userId;
    const results = await db.findDashboardByUserId(id);
    return res.json(results);
  } catch (err) {
    next(err);
  }
});

/** Get :ID */
router.get(
  '/:id',
  [validateRequest({ params: detailSchema }), requireUser],
  async (req: any, res: any, next: any) => {
    try {
      const id = req.params.id;
      const user: ParsedToken = req.user;
      const { data } = req.body;
      const result = await db.findDashboardByIdWithIncludes(id);
      res.json(result);
      return res.json({ user, data });
    } catch (err) {
      next(err);
    }
  }
);

/** Create */
router.post(
  '/',
  [validateRequest({ body: createDashboardSchema }), requireUser],
  async (req: any, res: any, next: any) => {
    try {
      const user: ParsedToken = req.user;
      const { body } = req;
      const chartData = {
        userId: user.userId,
        ...body,
      };
      console.log(chartData);
      const result = await db.dashboardDb.create(chartData);

      return res.status(201).json(result);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
);

/** Delete ID */
router.delete(
  '/:id',
  [validateRequest({ params: detailSchema }), requireUser],
  async (req: any, res: any, next: any) => {
    try {
      const user: ParsedToken = req.user;
      const dashboardId = req.params.id;
      const dashboard = await db.dashboardDb.findById(dashboardId);
      if (!dashboard) {
        return res.json({ message: 'Not Found' }).status(404);
      }
      if (dashboard.userId !== user.userId) {
        return res.json({ message: 'Not Authorized' }).status(401);
      }
      const result = await db.deleteDashboardById(dashboardId);
      return res.status(204).json();
    } catch (err) {
      next(err);
    }
  }
);

/** Update slots */
router.put(
  '/:id/slots',
  [
    validateRequest({ body: updateSlotsSchema }),
    validateRequest({ params: detailSchema }),
    requireUser,
  ],
  async (req: any, res: any, next: any) => {
    try {
      const user: ParsedToken = req.user;
      const dashboardId = req.params.id;
      const dashboard = await db.findSlots(dashboardId);
      if (!dashboard) {
        return res.json({ message: 'Not Found' }).status(404);
      }
      if (dashboard.userId !== user.userId) {
        return res.json({ message: 'Not Authorized' }).status(401);
      }
      console.log('Updating dashboard', dashboardId);
      console.log('Updating dashboard', JSON.stringify(dashboard));
      const dashboardData = req.body;
      console.log('Dashboard Data', dashboardData);
      const { slots: storedSlots } = dashboard;
      const { slots: updatedSlots } = dashboardData;
      const { toCreate, toUpdate, toDelete } =
        db.separateCreateUpdateDeleteSlots(
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
      return res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

/** Update ID */
router.put(
  '/:id',
  [
    validateRequest({ body: updateDashboardSchema }),
    validateRequest({ params: detailSchema }),
    requireUser,
  ],
  async (req: any, res: any, next: any) => {
    try {
      const user: ParsedToken = req.user;
      const dashboardId = req.params.id;
      const dashboard = await db.dashboardDb.findById(dashboardId);
      if (!dashboard) {
        return res.json({ message: 'Not Found' }).status(404);
      }
      if (dashboard.userId !== user.userId) {
        return res.json({ message: 'Not Authorized' }).status(401);
      }
      console.log('Updating dashboard', dashboardId);
      const dashboardData = req.body;
      console.log('Dashboard Data', dashboardData);
      const result = await db.dashboardDb.update(dashboardId, dashboardData);
      return res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
