import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import * as z from "zod";
import db from "../lib/db";
import { logger } from "../lib/logger";
import { checkAuth, requireUser } from "../lib/middlewares-hono";
import type { ParsedToken } from "../types";

const router = new Hono();

// Apply auth check middleware to all routes
router.use("*", checkAuth);

// #region: COMMAND - CREATE

const createSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
});

type CreateParamsDictionary = {}
type CreateResponseBody = { id: string }
type CreateRequestBody = { name: string; description?: string }
// type CreateRequest = Request<CreateParamsDictionary, CreateResponseBody, CreateRequestBody>;
// type CreateResponse = Response<CreateResponseBody>;

router.post("/", requireUser, zValidator("json", createSchema), async (c) => {
    try {
        const user = c.get("user" as never) as ParsedToken;
        const body = c.req.valid("json");
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
        const result = await db.createKpiGroup(chartData);
        logger.info("kpiGroup created", {
            chartId: result.id,
            userId: user.userId,
        });
        return c.json(result, 201);
    } catch (err) {
        logger.error(
            "Dashboard create error",
            err instanceof Error ? err : undefined,
        );
        return c.json({ error: "Internal error" }, 500);
    }
});
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
// type UpdateRequest = Request<UpdateParamsDictionary, UpdateResponseBody, UpdateRequestBody>;
// type UpdateResponse = Response<UpdateResponseBody>;

router.put(
    '/:id',
    requireUser,
    zValidator("param", updateParamsSchema),
    zValidator("json", updateBodySchema),
    async (c) => {
        const id = c.req.valid("param").id;
        const body = c.req.valid("json");
        const { dataSource, config } = body;
        console.log("updating kpi group-params", id, config, dataSource);
        const r = await db.updateKpiGroup(id, { config, data: dataSource });
        console.log("update result", r);
        return c.json({ id });
    })
// #endregion

// #region: QUERY
const findByIdSchema = z.object({
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
// type FindByIdRequest = Request<FindByIdParamsDictionary, FindByIdResponseBody, FindByIdRequestBody>;
// type FindByIdResponse = Response<FindByIdResponseBody>;

router.get(
    '/:id',
    requireUser,
    zValidator("param", findByIdSchema),
    async (c) => {
        try {
            const id = c.req.valid("param").id;
            const result = await db.findKpiGroupById(id);
            if (!result) {
                //should be handled by a middleware
                return c.json({ message: 'KPI Group not found' }, 404);
            }
            const { name, description, config, data: dataSource } = result;

            return c.json({ data: { name, description, config, dataSource } });
        } catch (err) {
            logger.error(
                "Dashboard create error",
                err instanceof Error ? err : undefined,
            );
            return c.json({ error: "Internal error" }, 500);
        }
    }
);
// #endregion




export default router;
