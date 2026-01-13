import axios from "axios";
import { Hono } from "hono";
import * as z from "zod";
import db from "../lib/db";
import { checkAuth, requireUser } from "../lib/middlewares-hono";
import { logger } from "../lib/logger";
import type { ParsedToken } from "../types";
import type { Chart } from "../lib/db/prisma/client";
// import { zValidator } from "@hono/zod-validator";
import {
	validator as zValidator,
	resolver,
	describeRoute,
} from "hono-openapi";
import parseCSV from "../lib/parseCSV";
import { isArgumentsObject } from "util/types";

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

const chartSchema = z.object({
	id: z.string(),
	userId: z.string(),
	name: z.string().nullable(),
	description: z.string().nullable(),
	chart: z.string(),
	config: z.unknown().nullable(),
	data: z.unknown().nullable(),
	isRemote: z.boolean().nullable(),
	remoteUrl: z.string().nullable(),
	publish: z.boolean(),
	createdAt: z.string(),
	updatedAt: z.string(),
})
const chartListSchema = z.array(chartSchema);

const errorMessageSchema = z.object({
	error: z.string(),
});

const publishResultSchema = z.object({
	published: z.boolean(),
});

/** Index */
router.get("/",
	describeRoute({
		responses: {
			200: {
				description: "Successful response",
				content: {
					"application/json": {
						schema: resolver(chartListSchema),
					},
				},
			},
			401: {
				description: "Unauthorized",
				content: {
					"application/json": {
						schema: resolver(errorMessageSchema),
					},
				},
			},
			500: {
				description: "Internal error",
				content: {
					"application/json": {
						schema: resolver(errorMessageSchema),
					},
				},
			}
		}
	}), async (c) => {
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
router.get("/:id", describeRoute({
	responses: {
		200: {
			description: "Successful response",
			content: {
				"application/json": {
					schema: resolver(chartSchema),
				},
			},
		},
		401: {
			description: "Unauthorized",
			content: {
				"application/json": {
					schema: resolver(errorMessageSchema),
				},
			},
		},
		404: {
			description: "NotFound",
			content: {
				"application/json": {
					schema: resolver(errorMessageSchema),
				},
			},
		},
		500: {
			description: "Internal error",
			content: {
				"application/json": {
					schema: resolver(errorMessageSchema),
				},
			},
		}
	}
}), zValidator("param", detailSchema), async (c) => {
	try {
		const { id } = c.req.valid("param");
		const result = await db.findChartById(id);
		if (!result) {
			return c.json({ error: "Not Found" }, 404);
		}
		return c.json(result);
	} catch (err) {
		logger.error("Chart get error", err instanceof Error ? err : undefined);
		return c.json({ error: "Internal error" }, 500);
	}
});

/** Show :ID (public) */
router.get("/show/:id", describeRoute({
	responses: {
		200: {
			description: "Successful response",
			content: {
				"application/json": {
					schema: resolver(chartSchema),
				},
			},
		},
		401: {
			description: "Unauthorized",
			content: {
				"application/json": {
					schema: resolver(errorMessageSchema),
				},
			},
		},
		404: {
			description: "Not Found",
			content: {
				"application/json": {
					schema: resolver(errorMessageSchema),
				},
			},
		},
		500: {
			description: "Internal error",
			content: {
				"application/json": {
					schema: resolver(errorMessageSchema),
				},
			},
		}
	}
}), zValidator("param", detailSchema), async (c) => {
	try {
		const { id } = c.req.valid("param");
		let result = await db.findChartById(id);
		if (!result) {
			return c.json({ error: "Not Found" }, 404);
		}
		if (result?.publish !== true) {
			return c.json(
				{
					error: { message: "Unauthorized" },
				},
				401,
			);
		}
		if (result?.isRemote && result?.remoteUrl) {
			console.log("Fetching remote data for chart", id);
			const lastUpdate = new Date(result.updatedAt);
			const now = Date.now();
			const diff = now - lastUpdate.getTime();
			const isToUpdate = diff > 1000 * 60 * 60 * 24;
			if (isToUpdate) {
				console.log("Server data is stale, updating...");
				const response = await axios.get("" + result.remoteUrl);
				console.log("REMOTE RESPONSE TYPE", response.headers['content-type']);
				let data
				if (response.headers['content-type']?.includes('application/json')) {
					data = response.data;
				} else {
					const csv = await parseCSV(response.data);
					console.log("parsed csv", csv);
					data = csv.data;
				}
				if (data) {
					const updatedChartData = {
						isRemote: result.isRemote,
						remoteUrl: result.remoteUrl,
						data,
					}
					console.log("Updating chart with remote data", updatedChartData);
					await db.updateChart(id, updatedChartData);
					result = await db.findChartById(id);
				}
			} else {
				console.log("Server data is fresh, no update needed.");
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
	describeRoute({
		responses: {
			201: {
				description: "Successful response",
				content: {
					"application/json": {
						schema: resolver(chartSchema),
					},
				},
			},
			401: {
				description: "Unauthorized",
				content: {
					"application/json": {
						schema: resolver(errorMessageSchema),
					},
				},
			},
			500: {
				description: "Internal error",
				content: {
					"application/json": {
						schema: resolver(errorMessageSchema),
					},
				},
			}
		}
	}),
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
	describeRoute({
		responses: {
			200: {
				description: "Successful response",
				content: {
					"application/json": {
						schema: resolver(publishResultSchema),
					},
				},
			},
			401: {
				description: "Unauthorized",
				content: {
					"application/json": {
						schema: resolver(errorMessageSchema),
					},
				},
			},
			404: {
				description: "Not Found",
				content: {
					"application/json": {
						schema: resolver(errorMessageSchema),
					},
				},
			},
			500: {
				description: "Internal error",
				content: {
					"application/json": {
						schema: resolver(errorMessageSchema),
					},
				},
			}
		}
	}),
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
	describeRoute({
		responses: {
			200: {
				description: "Successful response",
				content: {
					"application/json": {
						schema: resolver(chartSchema),
					},
				},
			},
			401: {
				description: "Unauthorized",
				content: {
					"application/json": {
						schema: resolver(errorMessageSchema),
					},
				},
			},
			404: {
				description: "Not Found",
				content: {
					"application/json": {
						schema: resolver(errorMessageSchema),
					},
				},
			},
			500: {
				description: "Internal error",
				content: {
					"application/json": {
						schema: resolver(errorMessageSchema),
					},
				},
			}
		}
	}),
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
	describeRoute({
		responses: {
			200: {
				description: "Successful response",
				content: {
					"application/json": {
						schema: resolver(chartSchema),
					},
				},
			},
			401: {
				description: "Unauthorized",
				content: {
					"application/json": {
						schema: resolver(errorMessageSchema),
					},
				},
			},
			404: {
				description: "Not Found",
				content: {
					"application/json": {
						schema: resolver(errorMessageSchema),
					},
				},
			},
			500: {
				description: "Internal error",
				content: {
					"application/json": {
						schema: resolver(errorMessageSchema),
					},
				},
			}
		}
	}),
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
