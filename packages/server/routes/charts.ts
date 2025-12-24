import axios from "axios";
import { Hono } from "hono";
import * as z from "zod";
import db from "../lib/db";
import { zValidator } from "@hono/zod-validator";
import { checkAuth, requireUser } from "../lib/middlewares-hono";
import { logger } from "../lib/logger";
import type { ParsedToken } from "../types";

const router = new Hono();

// Apply auth check middleware to all routes
router.use("*", checkAuth);

const detailSchema = z.object({
	id: z.string({
		error: "Id is required",
	}),
});

const createChartSchema = z.object({
	name: z.string().optional(),
	description: z.string().optional(),
	chart: z.string({
		error: "Chart type is required",
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
router.get("/", async (c) => {
	try {
		const user = c.get("user") as ParsedToken | null;
		if (!user) {
			return c.json({ error: "Unauthorized" }, 401);
		}
		const id = user.userId;
		const results = await db.findChartsByUSerId(id);
		return c.json(results);
	} catch (err) {
		logger.error("Charts index error", err instanceof Error ? err : undefined);
		return c.json({ error: "Internal error" }, 500);
	}
});

/** Get :ID */
router.get("/:id", zValidator("param", detailSchema), async (c) => {
	try {
		const { id } = c.req.valid("param");
		const result = await db.findChartById(id);
		return c.json(result);
	} catch (err) {
		logger.error("Chart get error", err instanceof Error ? err : undefined);
		return c.json({ error: "Internal error" }, 500);
	}
});

/** Show :ID (public) */
router.get("/show/:id", zValidator("param", detailSchema), async (c) => {
	try {
		const { id } = c.req.valid("param");
		let result = await db.findChartById(id);
		if (result?.publish !== true) {
			return c.json(
				{
					error: { message: "Not Authorized, This chart is not public" },
				},
				401,
			);
		}
		if (result?.isRemote && result?.remoteUrl) {
			const lastUpdate = new Date(result.updatedAt);
			const now = Date.now();
			const diff = now - lastUpdate.getTime();
			const isToUpdate = diff > 1000 * 60 * 60 * 24;
			if (isToUpdate) {
				const remote = await axios.get("" + result.remoteUrl);
				if (remote.data) {
					await db.updateChart(id, { data: remote.data });
					result = await db.findChartById(id);
				}
			}
		}
		return c.json(result);
	} catch (err) {
		logger.error("Chart show error", err instanceof Error ? err : undefined);
		return c.json({ error: "Internal error" }, 500);
	}
});

/** Create */
router.post(
	"/",
	requireUser,
	zValidator("json", createChartSchema),
	async (c) => {
		try {
			const body = c.req.valid("json");
			const user = c.get("user") as ParsedToken;

			const chartData = {
				userId: user.userId,
				...body,
			};
			const result = await db.createChart(chartData);

			logger.info("Chart created", {
				chartId: result.id,
				userId: user.userId,
				chartType: body.chart,
			});

			return c.json(result, 201);
		} catch (err) {
			logger.error(
				"Chart create error",
				err instanceof Error ? err : undefined,
			);
			return c.json({ error: "Internal error" }, 500);
		}
	},
);

/** Publish */
router.post(
	"/publish/:id",
	requireUser,
	zValidator("param", detailSchema),
	async (c) => {
		try {
			const user = c.get("user") as ParsedToken;
			const { id: chartId } = c.req.valid("param");
			const chart = await db.findChartById(chartId);
			if (!chart) {
				return c.json({ message: "Not Found" }, 404);
			}
			if (chart.userId !== user.userId) {
				return c.json({ message: "Not Authorized" }, 401);
			}
			const result = await db.publishChart(chartId, !chart?.publish);

			logger.info("Chart publish toggled", {
				chartId,
				userId: user.userId,
				published: result.publish,
			});

			return c.json({ published: result.publish });
		} catch (err) {
			logger.error(
				"Chart publish error",
				err instanceof Error ? err : undefined,
			);
			return c.json({ error: "Internal error" }, 500);
		}
	},
);

/** Delete ID */
router.delete(
	"/:id",
	requireUser,
	zValidator("param", detailSchema),
	async (c) => {
		try {
			const user = c.get("user") as ParsedToken;
			const { id: chartId } = c.req.valid("param");
			const chart = await db.findChartById(chartId);
			if (!chart) {
				return c.json({ message: "Not Found" }, 404);
			}
			if (chart.userId !== user.userId) {
				return c.json({ message: "Not Authorized" }, 401);
			}
			const result = await db.deleteChart(chartId);

			logger.info("Chart deleted", { chartId, userId: user.userId });

			return c.json(result);
		} catch (err) {
			logger.error(
				"Chart delete error",
				err instanceof Error ? err : undefined,
			);
			return c.json({ error: "Internal error" }, 500);
		}
	},
);

/** Update ID */
router.put(
	"/:id",
	requireUser,
	zValidator("param", detailSchema),
	zValidator("json", updateChartSchema),
	async (c) => {
		try {
			const user = c.get("user") as ParsedToken;
			const { id: chartId } = c.req.valid("param");
			const chartData = c.req.valid("json");

			const chart = await db.findChartById(chartId);
			if (!chart) {
				return c.json({ message: "Not Found" }, 404);
			}
			if (chart.userId !== user.userId) {
				return c.json({ message: "Not Authorized" }, 401);
			}
			const result = await db.updateChart(chartId, chartData);

			logger.debug("Chart updated", { chartId, userId: user.userId });

			return c.json(result);
		} catch (err) {
			logger.error(
				"Chart update error",
				err instanceof Error ? err : undefined,
			);
			return c.json({ error: "Internal error" }, 500);
		}
	},
);

export default router;
