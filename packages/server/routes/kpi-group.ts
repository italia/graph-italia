import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import * as z from "zod";
import db from "../lib/db";
import { logger } from "../lib/logger";
import type { ParsedToken } from "../types";
import { checkAuth, requireUser } from "../lib/middlewares-hono";

const createSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
});

const router = new Hono();

// Apply auth check middleware to all routes
router.use("*", checkAuth);

router.post("/", requireUser, zValidator("json", createSchema), async (c) => {
	try {
		const user = c.get("user") as ParsedToken;
		const body = c.req.valid("json");
		const chartData = {
			userId: user.userId,
			chart: "kpiGroup",
			...body,
		};
		const result = await db.kpiGroupDb.create(chartData);
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

export default router;
