import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import * as z from "zod";
import db from "../lib/db";
import { logger } from "../lib/logger";
import { canModify, checkAuth, requireAuth } from "../lib/middlewares";
import type { AppVariables, ParsedToken } from "../types";

type Env = { Variables: AppVariables };
const router = new Hono<Env>();

router.use("*", checkAuth);

// #region: COMMAND - CREATE
const createSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
});

type CreateResponseBody = { id: string }

router.post("/", requireAuth, zValidator("json", createSchema), async (c) => {
    try {
        // kpiGroup creation requires a userId — not available via API key
        const user = c.get("user") as ParsedToken | null;
        if (!user) return c.json({ error: "User authentication required for this operation" }, 403);

        const projectId = c.get("projectId");
        if (!projectId) return c.json({ error: "No project found" }, 500);
        if (!(await canModify(c, projectId))) return c.json({ error: "Write access required" }, 403);

        const body = c.req.valid("json");
        const chartData = {
            userId: user.userId,
            chart: 'kpiGroup' as 'kpiGroup',
            config: {
                direction: "vertical",
                h: 500,
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
                background: "",
            },
            data: [],
            ...body,
        };
        const result = await db.createKpiGroup(chartData);
        return c.json<CreateResponseBody>(result, 201);
    } catch (err) {
        logger.error("KpiGroup create error", err instanceof Error ? err : undefined);
        return c.json({ error: "Internal error" }, 500);
    }
});
// #endregion

// #region: COMMAND - UPDATE
const updateParamsSchema = z.object({
    id: z.string({ message: 'Id is required' }),
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
    name: z.string(),
    description: z.string().optional(),
    publish: z.boolean().optional(),
    config: configSchema,
    dataSource: datasourceArraySchema,
});

router.put(
    '/:id',
    requireAuth,
    zValidator("param", updateParamsSchema),
    zValidator("json", updateBodySchema),
    async (c) => {
        try {
            const id = c.req.valid("param").id;
            const body = c.req.valid("json");
            const { dataSource, config } = body;
            const { name = "", description = "", publish = true } = body;

            const kpi = await db.findKpiGroupById(id);
            if (!kpi) return c.json({ error: "Not Found" }, 404);
            if (!(await canModify(c, kpi.projectId))) return c.json({ error: "Write access required" }, 403);

            await db.updateKpiGroup(id, { name, description, publish, config, data: dataSource });
            return c.json({ id });
        } catch (err) {
            logger.error("KpiGroup update error", err instanceof Error ? err : undefined);
            return c.json({ error: "Internal error" }, 500);
        }
    })
// #endregion

// #region: QUERY
const findByIdSchema = z.object({ id: z.string({ message: 'Id is required' }) });
type FindByIdResponseBody = {
    data: {
        name: string;
        description: string,
        config: unknown,
        dataSource: object[]
    }
} | { message: string };

router.get(
    '/:id',
    requireAuth,
    zValidator("param", findByIdSchema),
    async (c) => {
        try {
            const id = c.req.valid("param").id;
            const result = await db.findKpiGroupById(id);
            if (!result) {
                return c.json({ message: 'KPI Group not found' }, 404);
            }
            const { name, description, config, data: dataSource } = result;
            return c.json<FindByIdResponseBody>({ data: { name, description, config, dataSource } });
        } catch (err) {
            logger.error("KpiGroup get error", err instanceof Error ? err : undefined);
            return c.json({ error: "Internal error" }, 500);
        }
    }
);
// #endregion

export default router;
