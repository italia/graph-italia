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

router.post(
    '/',
    [validateRequest({ body: createSchema }), requireUser],
    async (req: Request<{}, { id: string }, { name: string; description?: string }>, res: Response<{ id: string }>, next: any) => {
        try {
            const user: ParsedToken = (req as AuthenticatedRequest).user!;
            const { body } = req;
            const chartData = {
                userId: user.userId,
                chart: 'kpiGroup',
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

export default router;