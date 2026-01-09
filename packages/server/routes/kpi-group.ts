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
type CreateParamsDictionary = {}
type CreateResponseBody = { id: string }
type CreateRequestBody = { name: string; description?: string }
type CreateRequest = Request<CreateParamsDictionary, CreateResponseBody, CreateRequestBody>;
type CreateResponse = Response<CreateResponseBody>;
router.post(
    '/',
    [validateRequest({ body: createSchema }), requireUser],
    async (req: CreateRequest, res: CreateResponse, next: any) => {
        try {
            const user: ParsedToken = (req as AuthenticatedRequest).user!;
            const { body } = req;
            const chartData = {
                userId: user.userId,
                chart: 'kpiGroup' as 'kpiGroup',
                config: {
                    direction: "vertical",
                    h: 0,
                    labeLine: false,
                    legend: false,
                    legendPosition: "",
                    palette: [],
                    tooltip: false,
                    tooltipFormatter: "",
                    valueFormatter: "",
                    totalLabel: "",
                    tooltipTrigger: "",
                    colors: [],
                    background: "skyblue",
                },
                ...body,
            };
            console.log(chartData);
            const result = await db.createKpiGroup(chartData);

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
type FindByIdParamsDictionary = { id: string }
type FindByIdResponseBody = {
    data: {
        name: string; description: string, config: any
    }
} | { message: string };
type FindByIdRequestBody = undefined
type FindByIdRequest = Request<FindByIdParamsDictionary, FindByIdResponseBody, FindByIdRequestBody>;
type FindByIdResponse = Response<FindByIdResponseBody>;
router.get(
    '/:id',
    [validateRequest({ params: detailSchema }), requireUser],
    async (req: FindByIdRequest, res: FindByIdResponse, next: any) => {
        try {
            const id = req.params.id;
            const result = await db.findKpiGroupById(id);
            if (!result) {
                //should be handled by a middleware
                return res.status(404).json({ message: 'KPI Group not found' });
            }
            const { name, description, config } = result;

            return res.json({ data: { name, description, config } });
        } catch (err) {
            next(err);
        }
    }
);
// #endregion

export default router;