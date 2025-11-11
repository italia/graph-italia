import axios from 'axios';
import { Router } from 'express';
import * as z from 'zod';
import db from '../lib/db';

import { requireUser, validateRequest } from '../lib/middlewares';
import type { ParsedToken } from '../types';

const router = Router();

const detailSchema = z.object({
  id: z.string({
    required_error: 'Id is required',
  }),
});

const createChartSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  chart: z.string({
    required_error: 'Chart type is required',
  }),
  config: z.unknown().optional(),
  data: z.unknown().optional(),
  remoteUrl: z.string().nullable().optional(),
  isRemote: z.boolean().optional(),
  publish: z.boolean().optional(),
  preview: z.string().nullable().optional(),
});

const updateChartSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  chart: z.string().optional(),
  config: z.unknown().optional(),
  data: z.unknown().optional(),
  publish: z.boolean().optional(),
  remoteUrl: z.string().nullable().optional(),
  isRemote: z.boolean().optional(),
  id: z.string().optional(),
  preview: z.string().nullable().optional(),
  slots: z.array(z.string()).nullable().optional(),
});

/** Index */
router.get('/', requireUser, async (req: any, res, next) => {
  try {
    const user: ParsedToken = req.user;
    const id = user.userId;
    const results = await db.findChartsByUSerId(id);
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
      const result = await db.findChartById(id);
      res.json(result);
      return res.json({ user, data });
    } catch (err) {
      next(err);
    }
  }
);

/** Show :ID */
router.get(
  '/show/:id',
  validateRequest({ params: detailSchema }),
  async (req: any, res, next) => {
    try {
      const id = req.params.id;
      let result = await db.findChartById(id);
      if (result?.publish !== true) {
        return res.json({
          error: { message: 'Not Authorized, This chart is not public' },
        });
      }
      if (result?.isRemote && result?.remoteUrl) {
        const lastUpdate = new Date(result.updatedAt);
        const now = Date.now();
        const diff = now - lastUpdate.getTime();
        // console.log("Diff", diff / 1000 / 60, "minutes");
        const isToUpdate = diff > 1000 * 60 * 60 * 24;
        if (isToUpdate) {
          //refresh data.
          const remote = await axios.get('' + result.remoteUrl);
          if (remote.data) {
            await db.updateChart(id, { data: remote.data });
            result = await db.findChartById(id);
          }
        }
      }
      return res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

/** Create */
router.post(
  '/',
  // [validateRequest({ body: createChartSchema }), requireUser],
  async (req: any, res: any, next: any) => {
    try {
      const { body } = req;
      console.log('CREATE CHART', body);

      const user: ParsedToken = req.user;
      console.log('user?', user);

      if (!req) throw new Error('empty data');

      const chartData = {
        userId: user.userId,
        ...body,
      };
      const result = await db.createChart(chartData);

      return res.json(result);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
);

/** Publish */
router.post(
  '/publish/:id',
  [validateRequest({ params: detailSchema }), requireUser],
  async (req: any, res: any, next: any) => {
    try {
      const user: ParsedToken = req.user;
      const chartId = req.params.id;
      const chart = await db.findChartById(chartId);
      if (!chart) {
        return res.json({ message: 'Not Found' }).status(404);
      }
      if (chart.userId !== user.userId) {
        return res.json({ message: 'Not Authorized' }).status(401);
      }
      const result = await db.publishChart(chartId, !chart?.publish);
      return res.json({ published: result.publish });
    } catch (err) {
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
      const chartId = req.params.id;
      const chart = await db.findChartById(chartId);
      if (!chart) {
        return res.json({ message: 'Not Found' }).status(404);
      }
      if (chart.userId !== user.userId) {
        return res.json({ message: 'Not Authorized' }).status(401);
      }
      const result = await db.deleteChart(chartId);
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
    validateRequest({ body: updateChartSchema }),
    validateRequest({ params: detailSchema }),
    requireUser,
  ],
  async (req: any, res: any, next: any) => {
    try {
      const user: ParsedToken = req.user;
      const chartId = req.params.id;
      const chart = await db.findChartById(chartId);
      if (!chart) {
        return res.json({ message: 'Not Found' }).status(404);
      }
      if (chart.userId !== user.userId) {
        return res.json({ message: 'Not Authorized' }).status(401);
      }
      const chartData = req.body;
      const result = await db.updateChart(chartId, chartData);
      return res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
