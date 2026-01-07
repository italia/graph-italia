import { Router, type Request, type Response } from "express";
import z from "zod";
import db from "../lib/db";
import { requireUser, validateRequest, type AuthenticatedRequest } from "../lib/middlewares";
import type { ParsedToken } from "../types";

const createSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
});

const router = Router();

// #region: COMMAND
router.post(
    '/',
    [validateRequest({ body: createSchema }), requireUser],
    async (req: Request<{}, { id: string }, { name: string; description?: string }>, res: Response<{ id: string }>, next: any) => {
        try {
            const user: ParsedToken = (req as AuthenticatedRequest).user!;
            const { body } = req;
            const chartData = {
                userId: user.userId,
                chart: 'kpiGroup' as 'kpiGroup',
                ...body,
            };
            console.log(chartData);
            const result = await db.kpiGroupDb.create(chartData);

            return res.status(201).json(result);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
);
// #endregion

// #region: QUERY
const detailSchema = z.object({
    id: z.string({
        message: 'Id is required',
    }),
});
router.get(
    '/:id',
    [validateRequest({ params: detailSchema }), requireUser],
    async (req: any, res: any, next: any) => {
        try {
            const id = req.params.id;
            //const user: ParsedToken = req.user;
            const result = await db.findKpiGroupById(id);
            if (!result) {
                return res.status(404).json({ message: 'KPI Group not found' });
            }
            const { name, description } = result;
            return res.json({ data: { name, description } });
            //return res.json({ user, data });
        } catch (err) {
            next(err);
        }
    }
);
// #endregion

export default router;