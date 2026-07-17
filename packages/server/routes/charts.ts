import axios from "axios";
import { Hono } from "hono";
import * as z from "zod";
import { rateLimiter } from "hono-rate-limiter";
import db from "../lib/db";
import { checkAuth, requireAuth, canModify, canRead } from "../lib/middlewares";
import { logger } from "../lib/logger";
import type { AppVariables, ParsedToken } from "../types";
import {
	validator as zValidator,
	resolver,
	describeRoute,
} from "hono-openapi";
import parseCSV from "../lib/parseCSV";
import { applyDataTransform, isDataTransform, type Matrix } from "../lib/dataTransform";

type Env = { Variables: AppVariables };
const router = new Hono<Env>();

router.use("*", checkAuth);

// Limit chart creation to 20 per minute per authenticated user (or IP as fallback).
// This is a backstop against runaway client-side loops, not a general throttle.
const chartCreateLimiter = rateLimiter<Env>({
	windowMs: 60 * 1000,
	limit: 20,
	keyGenerator: (c) => (c.get("user") as ParsedToken | null)?.userId ?? c.req.header("x-forwarded-for") ?? "unknown",
	handler: (c) => c.json({ error: "Too many chart creations, please try again later." }, 429),
});

const detailSchema = z.object({
	id: z.string({ error: "Id is required" }),
});

const createChartSchema = z.object({
	name: z.string().optional(),
	description: z.string().optional(),
	chart: z.string({ error: "Chart type is required" }),
	config: z.unknown().optional(),
	data: z.unknown().optional(),
	dataSource: z.unknown().optional(),
	remoteUrl: z.string().nullable().optional(),
	isRemote: z.boolean().optional(),
	publish: z.boolean().optional(),
	preview: z.string().nullable().optional(),
	projectId: z.string().optional(),
});

const updateChartSchema = z.object({
	name: z.string().optional(),
	description: z.string().optional(),
	chart: z.string().optional(),
	config: z.unknown().optional(),
	data: z.unknown().optional(),
	dataSource: z.unknown().optional(),
	publish: z.boolean().optional(),
	remoteUrl: z.string().nullable().optional(),
	isRemote: z.boolean().optional(),
	id: z.string().optional(),
	preview: z.string().nullable().optional(),
	slots: z.array(z.string()).nullable().optional(),
});

const chartSchema = z.object({
	id: z.string(),
	projectId: z.string(),
	name: z.string().nullable(),
	description: z.string().nullable(),
	chart: z.string(),
	dataSource: z.unknown().optional(),
	config: z.unknown().nullable(),
	data: z.unknown().nullable(),
	isRemote: z.boolean().nullable(),
	remoteUrl: z.string().nullable(),
	publish: z.boolean(),
	createdAt: z.string(),
	updatedAt: z.string(),
});
const chartListSchema = z.array(chartSchema);
const errorMessageSchema = z.object({ error: z.string() });
const publishResultSchema = z.object({ published: z.boolean() });

/** Index — returns charts for the caller's project (user default or API key project) */
router.get(
	"/",
	describeRoute({
		responses: {
			200: { description: "Successful response", content: { "application/json": { schema: resolver(chartListSchema) } } },
			401: { description: "Unauthorized", content: { "application/json": { schema: resolver(errorMessageSchema) } } },
			500: { description: "Internal error", content: { "application/json": { schema: resolver(errorMessageSchema) } } },
		},
	}),
	requireAuth,
	async (c) => {
		try {
			const projectId = c.get("projectId");
			if (!projectId) return c.json([]);
			return c.json(await db.findChartsByProjectId(projectId));
		} catch (err) {
			logger.error("Charts index error", err instanceof Error ? err : undefined);
			return c.json({ error: "Internal error" }, 500);
		}
	},
);

/** Get :ID */
router.get(
	"/:id",
	describeRoute({
		responses: {
			200: { description: "Successful response", content: { "application/json": { schema: resolver(chartSchema) } } },
			401: { description: "Unauthorized", content: { "application/json": { schema: resolver(errorMessageSchema) } } },
			404: { description: "Not Found", content: { "application/json": { schema: resolver(errorMessageSchema) } } },
			500: { description: "Internal error", content: { "application/json": { schema: resolver(errorMessageSchema) } } },
		},
	}),
	requireAuth,
	zValidator("param", detailSchema),
	async (c) => {
		try {
			const { id } = c.req.valid("param");
			const result = await db.findChartById(id);
			// Unpublished charts are private: 404 on missing OR unauthorized (no
			// id enumeration). Public read is served by /show/:id (publish-gated).
			if (!result || !(await canRead(c, result.projectId))) return c.json({ error: "Not Found" }, 404);
			return c.json(result);
		} catch (err) {
			logger.error("Chart get error", err instanceof Error ? err : undefined);
			return c.json({ error: "Internal error" }, 500);
		}
	},
);

/** Show :ID (public) */
router.get(
	"/show/:id",
	describeRoute({
		responses: {
			200: { description: "Successful response", content: { "application/json": { schema: resolver(chartSchema) } } },
			401: { description: "Unauthorized", content: { "application/json": { schema: resolver(errorMessageSchema) } } },
			404: { description: "Not Found", content: { "application/json": { schema: resolver(errorMessageSchema) } } },
			500: { description: "Internal error", content: { "application/json": { schema: resolver(errorMessageSchema) } } },
		},
	}),
	zValidator("param", detailSchema),
	async (c) => {
		try {
			const { id } = c.req.valid("param");
			let result = await db.findChartById(id);
			if (!result) return c.json({ error: "Not Found" }, 404);
			if (result.publish !== true) return c.json({ error: { message: "Unauthorized" } }, 401);


			if (result.isRemote && result.remoteUrl) {
				const diff = Date.now() - new Date(result.updatedAt).getTime();
				if (diff > 1000 * 60 * 60 * 24) {

					try {
						const response = await axios.get(`${result.remoteUrl}`);
						let data: unknown;
						if (response.headers["content-type"]?.includes("application/json")) {
							data = response.data;
						} else {
							const csv = await parseCSV(response.data);
							data = csv.data;
						}
						// Replay the editor recipe (column selection, aggregation) on the
						// fresh download: storing the raw source would silently discard
						// what the user built in the editor. If the recipe no longer fits
						// (source changed shape), keep the existing data.
						const transform = (result.config as { dataTransform?: unknown } | null)?.dataTransform;
						if (data && isDataTransform(transform)) {
							const transformed = applyDataTransform(data as Matrix, transform);
							if (!transformed) {
								logger.error(`Chart ${id}: remote source no longer matches its dataTransform recipe — keeping saved data`);
							}
							data = transformed;
						}
						if (data) {
							await db.updateChart(id, { isRemote: result.isRemote, remoteUrl: result.remoteUrl, data });
							result = await db.findChartById(id);
						}
					} catch (_) {
						logger.error("Error: fetching remote url failed");
					}
				}
			}
			return c.json(result);
		} catch (err) {
			logger.error("Chart show error", err instanceof Error ? err : undefined);
			return c.json({ error: "Internal error" }, 500);
		}
	},
);

/** Create — places chart in the caller's project */
router.post(
	"/",
	describeRoute({
		responses: {
			201: { description: "Successful response", content: { "application/json": { schema: resolver(chartSchema) } } },
			401: { description: "Unauthorized", content: { "application/json": { schema: resolver(errorMessageSchema) } } },
			403: { description: "Forbidden", content: { "application/json": { schema: resolver(errorMessageSchema) } } },
			500: { description: "Internal error", content: { "application/json": { schema: resolver(errorMessageSchema) } } },
		},
	}),
	requireAuth,
	chartCreateLimiter,
	zValidator("json", createChartSchema),
	async (c) => {
		try {
			const { projectId: bodyProjectId, ...body } = c.req.valid("json");
			const projectId = bodyProjectId ?? c.get("projectId");
			if (!projectId) return c.json({ error: "No project found" }, 500);
			if (!(await canModify(c, projectId))) return c.json({ error: "Write access required" }, 403);

			const result = await db.createChart({ projectId, ...body });
			logger.info("Chart created", { chartId: result.id, projectId, chartType: body.chart });
			return c.json(result, 201);
		} catch (err) {
			logger.error("Chart create error", err instanceof Error ? err : undefined);
			return c.json({ error: "Internal error" }, 500);
		}
	},
);

/** Publish */
router.post(
	"/publish/:id",
	describeRoute({
		responses: {
			200: { description: "Successful response", content: { "application/json": { schema: resolver(publishResultSchema) } } },
			401: { description: "Unauthorized", content: { "application/json": { schema: resolver(errorMessageSchema) } } },
			403: { description: "Forbidden", content: { "application/json": { schema: resolver(errorMessageSchema) } } },
			404: { description: "Not Found", content: { "application/json": { schema: resolver(errorMessageSchema) } } },
			500: { description: "Internal error", content: { "application/json": { schema: resolver(errorMessageSchema) } } },
		},
	}),
	requireAuth,
	zValidator("param", detailSchema),
	async (c) => {
		try {
			const { id: chartId } = c.req.valid("param");
			const chart = await db.findChartById(chartId);
			if (!chart) return c.json({ message: "Not Found" }, 404);
			if (!(await canModify(c, chart.projectId))) return c.json({ message: "Write access required" }, 403);

			const result = await db.publishChart(chartId, !chart.publish);
			logger.info("Chart publish toggled", { chartId, published: result.publish });
			return c.json({ published: result.publish });
		} catch (err) {
			logger.error("Chart publish error", err instanceof Error ? err : undefined);
			return c.json({ error: "Internal error" }, 500);
		}
	},
);

/** Delete :ID */
router.delete(
	"/:id",
	describeRoute({
		responses: {
			200: { description: "Successful response", content: { "application/json": { schema: resolver(chartSchema) } } },
			403: { description: "Forbidden", content: { "application/json": { schema: resolver(errorMessageSchema) } } },
			404: { description: "Not Found", content: { "application/json": { schema: resolver(errorMessageSchema) } } },
			500: { description: "Internal error", content: { "application/json": { schema: resolver(errorMessageSchema) } } },
		},
	}),
	requireAuth,
	zValidator("param", detailSchema),
	async (c) => {
		try {
			const { id: chartId } = c.req.valid("param");
			const chart = await db.findChartById(chartId);
			if (!chart) return c.json({ message: "Not Found" }, 404);
			if (!(await canModify(c, chart.projectId))) return c.json({ message: "Write access required" }, 403);

			const result = await db.deleteChart(chartId);
			logger.info("Chart deleted", { chartId });
			return c.json(result);
		} catch (err) {
			logger.error("Chart delete error", err instanceof Error ? err : undefined);
			return c.json({ error: "Internal error" }, 500);
		}
	},
);

/** Update :ID */
router.put(
	"/:id",
	describeRoute({
		responses: {
			200: { description: "Successful response", content: { "application/json": { schema: resolver(chartSchema) } } },
			403: { description: "Forbidden", content: { "application/json": { schema: resolver(errorMessageSchema) } } },
			404: { description: "Not Found", content: { "application/json": { schema: resolver(errorMessageSchema) } } },
			500: { description: "Internal error", content: { "application/json": { schema: resolver(errorMessageSchema) } } },
		},
	}),
	requireAuth,
	zValidator("param", detailSchema),
	zValidator("json", updateChartSchema),
	async (c) => {
		try {
			const { id: chartId } = c.req.valid("param");
			const chartData = c.req.valid("json");

			const chart = await db.findChartById(chartId);
			if (!chart) return c.json({ message: "Not Found" }, 404);
			if (!(await canModify(c, chart.projectId))) return c.json({ message: "Write access required" }, 403);

			const result = await db.updateChart(chartId, chartData);
			logger.debug("Chart updated", { chartId });
			return c.json(result);
		} catch (err) {
			logger.error("Chart update error", err instanceof Error ? err : undefined);
			return c.json({ error: "Internal error" }, 500);
		}
	},
);

export default router;
