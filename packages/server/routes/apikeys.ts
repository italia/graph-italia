import { Hono } from "hono";
import { describeRoute, resolver, validator as zValidator } from "hono-openapi";
import * as z from "zod";
import db from "../lib/db";
import { reinstateApiKey, revokeApiKey } from "../lib/db/apiKeyDb";
import { logger } from "../lib/logger";
import { checkAuth, requireAuth, requireUser } from "../lib/middlewares";
import type { ParsedToken } from "../types";

type Env = { Variables: { user: ParsedToken | null; token: string | undefined; projectId: string | null } };

const router = new Hono<Env>();
router.use("*", checkAuth);
router.use("*", requireUser);
router.use("*", requireAuth);

const errSchema = z.object({ error: z.string() });

const apiKeySchema = z.object({
  id: z.string(),
  prefix: z.string(),
  role: z.enum(["READONLY", "READWRITE"]),
  expire: z.number(),
  revokedAt: z.string().nullable(),
  projectId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const apiLogSchema = z.object({
  id: z.string(),
  method: z.string(),
  endpoint: z.string(),
  status: z.number(),
  responseTime: z.number(),
  timestamp: z.string(),
  apiKeyId: z.string().nullable(),
  projectName: z.string().nullable(),
});

const detailSchema = z.object({ id: z.string() });
const createSchema = z.object({
  role: z.enum(["READONLY", "READWRITE"]).default("READONLY"),
  expire: z.number().int().positive().default(60),
  projectId: z.string().optional(),
});
const logsLimitSchema = z.object({ limit: z.coerce.number().int().positive().max(500).default(100) });

// ─── Index ────────────────────────────────────────────────────────────────────

router.get(
  "/",
  describeRoute({
    description: "List all API keys for the current user across all accessible projects.",
    responses: {
      200: { description: "API key list", content: { "application/json": { schema: resolver(z.array(apiKeySchema)) } } },
      401: { description: "Unauthorized", content: { "application/json": { schema: resolver(errSchema) } } },
      500: { description: "Internal error", content: { "application/json": { schema: resolver(errSchema) } } },
    },
  }),
  async (c) => {
    try {
      const user = c.get("user") as ParsedToken;
      return c.json(await db.findApiKeysByUserId(user.userId));
    } catch (e) {
      logger.error("ApiKeys index error", e instanceof Error ? e : undefined);
      return c.json({ error: "Internal error" }, 500);
    }
  },
);

// ─── Create ───────────────────────────────────────────────────────────────────

router.post(
  "/",
  describeRoute({
    description: "Create a new API key. The raw key is returned once and never shown again.",
    responses: {
      201: { description: "Created API key (includes raw key)", content: { "application/json": { schema: resolver(apiKeySchema) } } },
      401: { description: "Unauthorized", content: { "application/json": { schema: resolver(errSchema) } } },
      500: { description: "Internal error", content: { "application/json": { schema: resolver(errSchema) } } },
    },
  }),
  zValidator("json", createSchema),
  async (c) => {
    try {
      const user = c.get("user") as ParsedToken;
      const { role, expire, projectId: bodyProjectId } = c.req.valid("json");

      const projectId = bodyProjectId ?? c.get("projectId");
      if (!projectId) return c.json({ error: "No project found" }, 500);

      const allowed = await db.canUserModifyProject(user.userId, projectId);
      if (!allowed) return c.json({ error: "Not Authorized" }, 401);

      const apiKey = await db.createApiKey(projectId, role, expire);
      logger.info("ApiKey created", { id: apiKey.id, projectId, userId: user.userId });
      return c.json(apiKey, 201);
    } catch (e) {
      logger.error("ApiKey create error", e instanceof Error ? e : undefined);
      return c.json({ error: "Internal error" }, 500);
    }
  },
);

// ─── Delete :id ───────────────────────────────────────────────────────────────

router.delete(
  "/:id",
  describeRoute({
    description: "Delete an API key by ID. Requires ADMIN or owner access on the key's project.",
    responses: {
      204: { description: "No Content" },
      401: { description: "Unauthorized", content: { "application/json": { schema: resolver(errSchema) } } },
      404: { description: "Not Found", content: { "application/json": { schema: resolver(errSchema) } } },
      500: { description: "Internal error", content: { "application/json": { schema: resolver(errSchema) } } },
    },
  }),
  zValidator("param", detailSchema),
  async (c) => {
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
  },
);

// ─── Revoke / Reinstate ───────────────────────────────────────────────────────

router.patch(
  "/:id/revoke",
  describeRoute({
    description: "Revoke an API key, disabling it without deleting it.",
    responses: {
      200: { description: "Revoked API key", content: { "application/json": { schema: resolver(apiKeySchema) } } },
      401: { description: "Unauthorized", content: { "application/json": { schema: resolver(errSchema) } } },
      404: { description: "Not Found", content: { "application/json": { schema: resolver(errSchema) } } },
      500: { description: "Internal error", content: { "application/json": { schema: resolver(errSchema) } } },
    },
  }),
  zValidator("param", detailSchema),
  async (c) => {
    try {
      const user = c.get("user") as ParsedToken;
      const { id } = c.req.valid("param");
      const apiKey = await db.findApiKeyById(id);
      if (!apiKey) return c.json({ error: "Not Found" }, 404);
      const allowed = await db.canUserModifyProject(user.userId, apiKey.projectId);
      if (!allowed) return c.json({ error: "Not Authorized" }, 401);
      const updated = await revokeApiKey(id);
      logger.info("ApiKey revoked", { id, userId: user.userId });
      return c.json(updated);
    } catch (e) {
      logger.error("ApiKey revoke error", e instanceof Error ? e : undefined);
      return c.json({ error: "Internal error" }, 500);
    }
  },
);

router.patch(
  "/:id/reinstate",
  describeRoute({
    description: "Reinstate a previously revoked API key.",
    responses: {
      200: { description: "Reinstated API key", content: { "application/json": { schema: resolver(apiKeySchema) } } },
      401: { description: "Unauthorized", content: { "application/json": { schema: resolver(errSchema) } } },
      404: { description: "Not Found", content: { "application/json": { schema: resolver(errSchema) } } },
      500: { description: "Internal error", content: { "application/json": { schema: resolver(errSchema) } } },
    },
  }),
  zValidator("param", detailSchema),
  async (c) => {
    try {
      const user = c.get("user") as ParsedToken;
      const { id } = c.req.valid("param");
      const apiKey = await db.findApiKeyById(id);
      if (!apiKey) return c.json({ error: "Not Found" }, 404);
      const allowed = await db.canUserModifyProject(user.userId, apiKey.projectId);
      if (!allowed) return c.json({ error: "Not Authorized" }, 401);
      const updated = await reinstateApiKey(id);
      logger.info("ApiKey reinstated", { id, userId: user.userId });
      return c.json(updated);
    } catch (e) {
      logger.error("ApiKey reinstate error", e instanceof Error ? e : undefined);
      return c.json({ error: "Internal error" }, 500);
    }
  },
);

// ─── Logs ─────────────────────────────────────────────────────────────────────

router.get(
  "/:id/logs",
  describeRoute({
    description: "Retrieve usage logs for a specific API key. Requires access to the key's project.",
    responses: {
      200: { description: "API log list", content: { "application/json": { schema: resolver(z.array(apiLogSchema)) } } },
      401: { description: "Unauthorized", content: { "application/json": { schema: resolver(errSchema) } } },
      404: { description: "Not Found", content: { "application/json": { schema: resolver(errSchema) } } },
      500: { description: "Internal error", content: { "application/json": { schema: resolver(errSchema) } } },
    },
  }),
  zValidator("param", detailSchema),
  zValidator("query", logsLimitSchema),
  async (c) => {
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
  },
);

export default router;
