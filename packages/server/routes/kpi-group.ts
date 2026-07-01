import { Hono } from "hono";
import { describeRoute, resolver, validator as zValidator } from "hono-openapi";
import * as z from "zod";
import db from "../lib/db";
import { logger } from "../lib/logger";
import { canModify, canRead, checkAuth, requireAuth } from "../lib/middlewares";
import type { AppVariables, ParsedToken } from "../types";

type Env = { Variables: AppVariables };
const router = new Hono<Env>();

router.use("*", checkAuth);

const errSchema = z.object({ error: z.string() });

// ─── Schemas ──────────────────────────────────────────────────────────────────

const createSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	projectId: z.string().optional(),
});

const configSchema = z.object({
	direction: z.enum(["vertical", "horizontal"]),
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
	flow_direction: z.enum(["+", "-"]),
	flow_detail: z.string().optional(),
	footer_text: z.string().optional(),
});

const updateParamsSchema = z.object({ id: z.string({ message: "Id is required" }) });
const findByIdSchema = z.object({ id: z.string({ message: "Id is required" }) });

const updateBodySchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	publish: z.boolean().optional(),
	config: configSchema,
	dataSource: z.array(datasourceSchema),
});

const kpiGroupResponseSchema = z.object({
	id: z.string(),
	name: z.string().nullable(),
	description: z.string().nullable(),
	config: z.unknown(),
	dataSource: z.array(datasourceSchema),
});

// ─── Create ───────────────────────────────────────────────────────────────────

router.post(
	"/",
	describeRoute({
		description: "Create a new KPI group chart. Requires an authenticated user session (not API key).",
		responses: {
			201: { description: "Created KPI group", content: { "application/json": { schema: resolver(z.object({ id: z.string() })) } } },
			401: { description: "Unauthorized", content: { "application/json": { schema: resolver(errSchema) } } },
			403: { description: "Write access required or user auth required", content: { "application/json": { schema: resolver(errSchema) } } },
			500: { description: "Internal error", content: { "application/json": { schema: resolver(errSchema) } } },
		},
	}),
	requireAuth,
	zValidator("json", createSchema),
	async (c) => {
		try {
			const user = c.get("user") as ParsedToken | null;
			if (!user) return c.json({ error: "User authentication required for this operation" }, 403);

			const { projectId: bodyProjectId, ...body } = c.req.valid("json");
			const projectId = bodyProjectId ?? c.get("projectId");
			if (!projectId) return c.json({ error: "No project found" }, 500);
			if (!(await canModify(c, projectId))) return c.json({ error: "Write access required" }, 403);

			const chartData = {
				projectId,
				chart: "kpiGroup" as const,
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
			return c.json({ id: result.id }, 201);
		} catch (err) {
			logger.error("KpiGroup create error", err instanceof Error ? err : undefined);
			return c.json({ error: "Internal error" }, 500);
		}
	},
);

// ─── Update ───────────────────────────────────────────────────────────────────

router.put(
	"/:id",
	describeRoute({
		description: "Update a KPI group's config and data source items. Requires READWRITE access.",
		responses: {
			200: { description: "Updated KPI group ID", content: { "application/json": { schema: resolver(z.object({ id: z.string() })) } } },
			401: { description: "Unauthorized", content: { "application/json": { schema: resolver(errSchema) } } },
			403: { description: "Write access required", content: { "application/json": { schema: resolver(errSchema) } } },
			404: { description: "Not Found", content: { "application/json": { schema: resolver(errSchema) } } },
			500: { description: "Internal error", content: { "application/json": { schema: resolver(errSchema) } } },
		},
	}),
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
	},
);

// ─── Get by ID ────────────────────────────────────────────────────────────────

router.get(
	"/:id",
	describeRoute({
		description: "Get a KPI group by ID including its config and data source items.",
		responses: {
			200: { description: "KPI group detail", content: { "application/json": { schema: resolver(z.object({ data: kpiGroupResponseSchema })) } } },
			401: { description: "Unauthorized", content: { "application/json": { schema: resolver(errSchema) } } },
			404: { description: "Not Found", content: { "application/json": { schema: resolver(errSchema) } } },
			500: { description: "Internal error", content: { "application/json": { schema: resolver(errSchema) } } },
		},
	}),
	requireAuth,
	zValidator("param", findByIdSchema),
	async (c) => {
		try {
			const id = c.req.valid("param").id;
			const result = await db.findKpiGroupById(id);
			// 404 on missing OR unauthorized (no cross-tenant read / id enumeration).
			if (!result || !(await canRead(c, result.projectId))) return c.json({ message: "KPI Group not found" }, 404);
			const { name, description, config, data: dataSource } = result;
			return c.json({ data: { name, description, config, dataSource } });
		} catch (err) {
			logger.error("KpiGroup get error", err instanceof Error ? err : undefined);
			return c.json({ error: "Internal error" }, 500);
		}
	},
);

export default router;
