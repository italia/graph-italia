import { Router, type Request, type Response } from "express";
import z from "zod";
import db from "../lib/db";
import { requireUser, validateRequest, type AuthenticatedRequest } from "../lib/middlewares";
import type { ParsedToken } from "../types";

const router = Router();

// #region: COMMAND - CREATE

const createSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
});

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
                data: [],
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

// #region: COMMAND - UPDATE
const updateParamsSchema = z.object({
    id: z.string({
        message: 'Id is required',
    }),
});
const configSchema = z.object({
    direction: z.enum(['vertical', 'horizontal']),
    h: z.number(),
    labeLine: z.boolean(),
    legend: z.boolean(),
    legendPosition: z.string(),
    palette: z.array(z.string()),
    tooltip: z.boolean(),
    tooltipFormatter: z.string(),
    valueFormatter: z.string(),
    totalLabel: z.string(),
    tooltipTrigger: z.string(),
    colors: z.array(z.string()),
    background: z.string(),
});

const datasourceSchema = z.object({
    title: z.string(),
    value: z.string(),
    percentage: z.string().optional(),
    background_color: z.string().optional(),
    value_prefix: z.string().optional(),
    value_suffix: z.string().optional(),
    show_flow: z.boolean(),
    flow_value: z.string(),
    flow_direction: z.enum(['+', '-']),
    flow_detail: z.string().optional(),
    footer_text: z.string().optional(),
});

const datasourceArraySchema = z.array(datasourceSchema);
const updateBodySchema = z.object({
    config: configSchema,
    dataSource: datasourceArraySchema,
});

type DatasourceDTO = z.infer<typeof datasourceSchema>;
type ConfigDTO = z.infer<typeof configSchema>;
type UpdateParamsDictionary = { id: string }
type UpdateResponseBody = { id: string }
type UpdateRequestBody = { config: ConfigDTO; dataSource: DatasourceDTO[] }
type UpdateRequest = Request<UpdateParamsDictionary, UpdateResponseBody, UpdateRequestBody>;
type UpdateResponse = Response<UpdateResponseBody>;

router.put(
    '/:id',
    [validateRequest({ params: updateParamsSchema, body: updateBodySchema }), requireUser],
    async (req: UpdateRequest, res: UpdateResponse, next: any) => {
        const id = req.params.id;
        const { body } = req;
        const { dataSource, config } = body;
        console.log("updating kpi group-params", id, config, dataSource);
        const r = await db.updateKpiGroup(id, { config, data: dataSource });
        console.log("update result", r);
        return res.json({ id });

    })
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
        name: string; description: string, config: any, dataSource: {}[]
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
            const { name, description, config, data: dataSource } = result;

            return res.json({ data: { name, description, config, dataSource } });
        } catch (err) {
            next(err);
        }
    }
);
// #endregion

export default router;