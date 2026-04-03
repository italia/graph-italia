import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import * as z from "zod";
import db from "../lib/db";
import { logger } from "../lib/logger";
import { checkAuth, requireAuth, canModify } from "../lib/middlewares";
import type { AppVariables } from "../types";

type Env = { Variables: AppVariables };
const router = new Hono<Env>();

router.use("*", checkAuth);

const detailSchema = z.object({
	id: z.string({ error: "Id is required" }),
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
	projectId: z.string().optional(),
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

/** Index — returns dashboards for the caller's project (user default or API key project) */
router.get("/", requireAuth, async (c) => {
	try {
		const projectId = c.get("projectId");
		if (!projectId) return c.json([]);
		return c.json(await db.findDashboardsByProjectId(projectId));
	} catch (err) {
		logger.error("Dashboard index error", err instanceof Error ? err : undefined);
		return c.json({ error: "Internal error" }, 500);
	}
});

/** Get :ID */
router.get("/:id", requireAuth, zValidator("param", detailSchema), async (c) => {
	try {
		const { id } = c.req.valid("param");
		const result = await db.findDashboardByIdWithIncludes(id);
		return c.json(result);
	} catch (err) {
		logger.error("Dashboard get error", err instanceof Error ? err : undefined);
		return c.json({ error: "Internal error" }, 500);
	}
});

/** Show :ID (public) */
router.get("/show/:id", zValidator("param", detailSchema), async (c) => {
	try {
		const { id } = c.req.valid("param");
		const result = await db.findDashboardByIdWithIncludes(id);
		if (!result) return c.json({ error: "Not Found" }, 404);
		if (result.publish !== true) return c.json({ error: { message: "Unauthorized" } }, 401);
		return c.json(result);
	} catch (err) {
		logger.error("Dashboard show error", err instanceof Error ? err : undefined);
		return c.json({ error: "Internal error" }, 500);
	}
});

/** Create — places dashboard in the caller's project */
router.post("/", requireAuth, zValidator("json", createDashboardSchema), async (c) => {
	try {
		const { projectId: bodyProjectId, ...body } = c.req.valid("json");
		const projectId = bodyProjectId ?? c.get("projectId");
		if (!projectId) return c.json({ error: "No project found" }, 500);
		if (!(await canModify(c, projectId))) return c.json({ error: "Write access required" }, 403);

		const result = await db.dashboardDb.create({ projectId, ...body });

		logger.info("Dashboard created", { dashboardId: result.id, projectId });
		return c.json(result, 201);
	} catch (err) {
		logger.error("Dashboard create error", err instanceof Error ? err : undefined);
		return c.json({ error: "Internal error" }, 500);
	}
});

/** Delete :ID */
router.delete("/:id", requireAuth, zValidator("param", detailSchema), async (c) => {
	try {
		const { id: dashboardId } = c.req.valid("param");
		const dashboard = await db.dashboardDb.findById(dashboardId);
		if (!dashboard) return c.json({ message: "Not Found" }, 404);
		if (!(await canModify(c, dashboard.projectId))) return c.json({ message: "Write access required" }, 403);

		await db.deleteDashboardById(dashboardId);
		logger.info("Dashboard deleted", { dashboardId });
		return c.body(null, 204);
	} catch (err) {
		logger.error("Dashboard delete error", err instanceof Error ? err : undefined);
		return c.json({ error: "Internal error" }, 500);
	}
});

/** Update slots */
router.put("/:id/slots", requireAuth, zValidator("param", detailSchema), zValidator("json", updateSlotsSchema), async (c) => {
	try {
		const { id: dashboardId } = c.req.valid("param");
		const dashboardData = c.req.valid("json");

		const dashboard = await db.findSlots(dashboardId);
		if (!dashboard) return c.json({ message: "Not Found" }, 404);
		if (!(await canModify(c, dashboard.projectId))) return c.json({ message: "Write access required" }, 403);

		const { slots: storedSlots } = dashboard;
		const { slots: updatedSlots } = dashboardData;
		const { toCreate, toUpdate, toDelete } = db.separateCreateUpdateDeleteSlots(
			storedSlots,
			updatedSlots,
			(s) => s.chartId,
		);

		const result = await db.updateSlots(dashboardId, {
			toCreate: toCreate as any,
			toUpdate: toUpdate as any,
			toDelete: toDelete as any,
		});

		logger.debug("Dashboard slots updated", {
			dashboardId,
			created: toCreate.length,
			updated: toUpdate.length,
			deleted: toDelete.length,
		});
		return c.json(result);
	} catch (err) {
		logger.error("Dashboard update slots error", err instanceof Error ? err : undefined);
		return c.json({ error: "Internal error" }, 500);
	}
});

/** Update :ID */
router.put("/:id", requireAuth, zValidator("param", detailSchema), zValidator("json", updateDashboardSchema), async (c) => {
	try {
		const { id: dashboardId } = c.req.valid("param");
		const dashboardData = c.req.valid("json");

		const dashboard = await db.dashboardDb.findById(dashboardId);
		if (!dashboard) return c.json({ message: "Not Found" }, 404);
		if (!(await canModify(c, dashboard.projectId))) return c.json({ message: "Write access required" }, 403);

		const result = await db.dashboardDb.update(dashboardId, dashboardData);
		logger.debug("Dashboard updated", { dashboardId });
		return c.json(result);
	} catch (err) {
		logger.error("Dashboard update error", err instanceof Error ? err : undefined);
		return c.json({ error: "Internal error" }, 500);
	}
});

export default router;
