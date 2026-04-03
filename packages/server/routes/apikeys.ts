import { Hono } from "hono";
import * as z from "zod";
import { validator as zValidator, resolver, describeRoute } from "hono-openapi";
import db from "../lib/db";
import { checkAuth, requireUser, requireAuth } from "../lib/middlewares";
import { logger } from "../lib/logger";
import type { ParsedToken } from "../types";

type Env = { Variables: { user: ParsedToken | null; token: string | undefined; projectId: string | null } };

const router = new Hono<Env>();
router.use("*", checkAuth);
router.use("*", requireUser);
router.use("*", requireAuth);

const detailSchema = z.object({ id: z.string() });
const createSchema = z.object({
  role: z.enum(["READONLY", "READWRITE"]).default("READONLY"),
  expire: z.number().int().positive().default(60),
  // optional: pass a projectId explicitly, otherwise falls back to active project or default
  projectId: z.string().optional(),
});
const logsLimitSchema = z.object({ limit: z.coerce.number().int().positive().max(500).default(100) });

// ─── Index ────────────────────────────────────────────────────────────────────

/** GET / — list api keys for the current user across all accessible projects */
router.get("/", async (c) => {
  try {
    const user = c.get("user") as ParsedToken;
    return c.json(await db.findApiKeysByUserId(user.userId));
  } catch (e) {

    logger.error("ApiKeys index error", e instanceof Error ? e : undefined);
    return c.json({ error: "Internal error" }, 500);
  }
});

// ─── Create ───────────────────────────────────────────────────────────────────

/**
 * POST / — create a new api key.
 * The raw key is returned ONCE here — it is never returned again after this.
 */
router.post("/", zValidator("json", createSchema), async (c) => {
  try {
    const user = c.get("user") as ParsedToken;
    const { role, expire, projectId: bodyProjectId } = c.req.valid("json");

    const projectId = bodyProjectId ?? c.get("projectId");
    if (!projectId) return c.json({ error: "No project found" }, 500);

    const allowed = await db.canUserModifyProject(user.userId, projectId);
    if (!allowed) return c.json({ error: "Not Authorized" }, 401);

    const apiKey = await db.createApiKey(projectId, role, expire);
    logger.info("ApiKey created", { id: apiKey.id, projectId, userId: user.userId });
    // Return full key ONCE on creation
    return c.json(apiKey, 201);
  } catch (e) {

    logger.error("ApiKey create error", e instanceof Error ? e : undefined);
    return c.json({ error: "Internal error" }, 500);
  }
});

// ─── Delete :id ───────────────────────────────────────────────────────────────

router.delete("/:id", zValidator("param", detailSchema), async (c) => {
  try {
    const user = c.get("user") as ParsedToken;
    const { id } = c.req.valid("param");
    const apiKey = await db.findApiKeyById(id);
    if (!apiKey) return c.json({ error: "Not Found" }, 404);
    const allowed = await db.canUserModifyProject(user.userId, apiKey.projectId);
    if (!allowed) return c.json({ error: "Not Authorized" }, 401);
    await db.deleteApiKey(id);
    logger.info("ApiKey deleted", { id, userId: user.userId });
    return c.body(null, 204);
  } catch (e) {
    logger.error("ApiKey delete error", e instanceof Error ? e : undefined);
    return c.json({ error: "Internal error" }, 500);
  }
});

// ─── Logs ─────────────────────────────────────────────────────────────────────

/** GET /:id/logs — usage logs for an api key */
router.get("/:id/logs", zValidator("param", detailSchema), zValidator("query", logsLimitSchema), async (c) => {
  try {
    const user = c.get("user") as ParsedToken;
    const { id } = c.req.valid("param");
    const { limit } = c.req.valid("query");
    const apiKey = await db.findApiKeyById(id);
    if (!apiKey) return c.json({ error: "Not Found" }, 404);
    const allowed = await db.canUserModifyProject(user.userId, apiKey.projectId);
    if (!allowed) return c.json({ error: "Not Authorized" }, 401);
    return c.json(await db.findLogsByApiKey(id, limit));
  } catch (e) {
    logger.error("ApiKey logs error", e instanceof Error ? e : undefined);
    return c.json({ error: "Internal error" }, 500);
  }
});

export default router;
