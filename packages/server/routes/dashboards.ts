import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import * as z from "zod";
import { checkAuth, requireUser } from "../lib/middlewares-hono";
import { logger } from "../lib/logger";
import type { ParsedToken } from "../types";
import db from "../lib/db";

const router = new Hono();

// Apply auth check middleware to all routes
router.use("*", checkAuth);

const detailSchema = z.object({
	id: z.string({
		error: "Id is required",
	}),
});

const slotSchema = z.object({
	chartId: z.string(),
	settings: z.object({}).passthrough().optional(),
	createdAt: z.coerce.date().default(() => new Date()),
	updatedAt: z.coerce.date().default(() => new Date()),
});

const createDashboardSchema = z.object({
	name: z.string().optional(),
	description: z.string().optional(),
	config: z.unknown().optional(),
	data: z.unknown().optional(),
	remoteUrl: z.string().nullable().optional(),
	isRemote: z.boolean().optional(),
	publish: z.boolean().optional(),
	preview: z.string().nullable().optional(),
});

const updateDashboardSchema = z.object({
	name: z.string().optional(),
	description: z.string().optional(),
	config: z.unknown().optional(),
	data: z.unknown().optional(),
	publish: z.boolean().optional(),
	remoteUrl: z.string().nullable().optional(),
	isRemote: z.boolean().optional(),
	id: z.string().optional(),
	preview: z.string().nullable().optional(),
	slots: z.array(slotSchema).optional(),
});

const updateSlotsSchema = z.object({
	slots: z.array(slotSchema),
});

/** Index */
router.get("/", async (c) => {
	try {
		const user = c.get("user") as ParsedToken | null;
		if (!user) {
			return c.json({ error: "Unauthorized" }, 401);
		}
		const id = user.userId;
		const results = await db.findDashboardByUserId(id);
		return c.json(results);
	} catch (err) {
		logger.error(
			"Dashboard index error",
			err instanceof Error ? err : undefined,
		);
		return c.json({ error: "Internal error" }, 500);
	}
});

/** Get :ID */
router.get(
	"/:id",
	requireUser,
	zValidator("param", detailSchema),
	async (c) => {
		try {
			const { id } = c.req.valid("param");
			const result = await db.findDashboardByIdWithIncludes(id);
			return c.json(result);
		} catch (err) {
			logger.error(
				"Dashboard get error",
				err instanceof Error ? err : undefined,
			);
			return c.json({ error: "Internal error" }, 500);
		}
	},
);


/** Show :ID (public) */
router.get(
	"/show/:id",
	zValidator("param", detailSchema),
	async (c) => {
		try {
			const { id } = c.req.valid("param");
			const result = await db.findDashboardByIdWithIncludes(id);
			if (!result) {
				return c.json({ error: "Not Found" }, 404);
			}
			if (result?.publish !== true) {
				return c.json({ error: { message: "Unauthorized" } }, 401);
			}
			return c.json(result);
		} catch (err) {
			logger.error(
				"Dashboard show error",
				err instanceof Error ? err : undefined,
			);
			return c.json({ error: "Internal error" }, 500);
		}
	},
);

/** Create */
router.post(
	"/",
	requireUser,
	zValidator("json", createDashboardSchema),
	async (c) => {
		try {
			const user = c.get("user") as ParsedToken;
			const body = c.req.valid("json");
			const chartData = {
				userId: user.userId,
				...body,
			};
			const result = await db.dashboardDb.create(chartData);

			logger.info("Dashboard created", {
				dashboardId: result.id,
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
			const { id: dashboardId } = c.req.valid("param");
			const dashboard = await db.dashboardDb.findById(dashboardId);
			if (!dashboard) {
				return c.json({ message: "Not Found" }, 404);
			}
			if (dashboard.userId !== user.userId) {
				return c.json({ message: "Not Authorized" }, 401);
			}
			await db.deleteDashboardById(dashboardId);

			logger.info("Dashboard deleted", { dashboardId, userId: user.userId });

			return c.body(null, 204);
		} catch (err) {
			logger.error(
				"Dashboard delete error",
				err instanceof Error ? err : undefined,
			);
			return c.json({ error: "Internal error" }, 500);
		}
	},
);

/** Update slots */
router.put(
	"/:id/slots",
	requireUser,
	zValidator("param", detailSchema),
	zValidator("json", updateSlotsSchema),
	async (c) => {
		try {
			const user = c.get("user") as ParsedToken;
			const { id: dashboardId } = c.req.valid("param");
			const dashboardData = c.req.valid("json");

			const dashboard = await db.findSlots(dashboardId);
			if (!dashboard) {
				return c.json({ message: "Not Found" }, 404);
			}
			if (dashboard.userId !== user.userId) {
				return c.json({ message: "Not Authorized" }, 401);
			}

			const { slots: storedSlots } = dashboard;
			const { slots: updatedSlots } = dashboardData;
			const { toCreate, toUpdate, toDelete } =
				db.separateCreateUpdateDeleteSlots(
					storedSlots,
					updatedSlots,
					(s) => s.chartId,
				);

			const result = await db.updateSlots(dashboardId, {
				toCreate,
				toUpdate,
				toDelete,
			});

			logger.debug("Dashboard slots updated", {
				dashboardId,
				userId: user.userId,
				created: toCreate.length,
				updated: toUpdate.length,
				deleted: toDelete.length,
			});

			return c.json(result);
		} catch (err) {
			logger.error(
				"Dashboard update slots error",
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
	zValidator("json", updateDashboardSchema),
	async (c) => {
		try {
			const user = c.get("user") as ParsedToken;
			const { id: dashboardId } = c.req.valid("param");
			const dashboardData = c.req.valid("json");

			const dashboard = await db.dashboardDb.findById(dashboardId);
			if (!dashboard) {
				return c.json({ message: "Not Found" }, 404);
			}
			if (dashboard.userId !== user.userId) {
				return c.json({ message: "Not Authorized" }, 401);
			}

			const result = await db.dashboardDb.update(dashboardId, dashboardData);

			logger.debug("Dashboard updated", { dashboardId, userId: user.userId });

			return c.json(result);
		} catch (err) {
			logger.error(
				"Dashboard update error",
				err instanceof Error ? err : undefined,
			);
			return c.json({ error: "Internal error" }, 500);
		}
	},
);

export default router;
