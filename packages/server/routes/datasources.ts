import { Hono } from "hono";
import * as z from "zod";
import { validator as zValidator, resolver, describeRoute } from "hono-openapi";
import db from "../lib/db";
import { checkAuth, requireUser } from "../lib/middlewares";
import { logger } from "../lib/logger";
import type { ParsedToken } from "../types";

const router = new Hono();
router.use("*", checkAuth);

const detailSchema = z.object({ id: z.string({ error: "Id is required" }) });

const createSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  data: z.unknown(),
  rules: z.unknown().optional(),
  publish: z.boolean().optional(),
  isTrasposed: z.boolean().optional(),
  remoteUrl: z.string().nullable().optional(),
  isRemote: z.boolean().optional(),
});

const updateSchema = createSchema.partial();
const linkSchema = z.object({ chartId: z.string(), config: z.unknown().optional() });

const errSchema = z.object({ error: z.string() });
const dataSourceSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  name: z.string().nullable(),
  description: z.string().nullable(),
  data: z.unknown(),
  rules: z.unknown().nullable(),
  publish: z.boolean(),
  isTrasposed: z.boolean(),
  remoteUrl: z.string().nullable(),
  isRemote: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
const dataSourceListSchema = z.array(dataSourceSchema);
const sourceLinkSchema = z.object({
  dataSourceId: z.string(),
  chartId: z.string(),
  config: z.unknown().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
const sourceLinkListSchema = z.array(sourceLinkSchema);

const R = {
  200: (desc: string, schema: z.ZodTypeAny) => ({ "200": { description: desc, content: { "application/json": { schema: resolver(schema) } } } }),
  201: (desc: string, schema: z.ZodTypeAny) => ({ "201": { description: desc, content: { "application/json": { schema: resolver(schema) } } } }),
  204: { description: "No Content" },
  401: { description: "Unauthorized", content: { "application/json": { schema: resolver(errSchema) } } },
  404: { description: "Not Found", content: { "application/json": { schema: resolver(errSchema) } } },
  500: { description: "Internal error", content: { "application/json": { schema: resolver(errSchema) } } },
};

// ─── Index ────────────────────────────────────────────────────────────────────

router.get(
  "/",
  describeRoute({
    description: "List all data sources for the current user's default project",
    responses: { ...R[200]("Data source list", dataSourceListSchema), 401: R[401], 500: R[500] },
  }),
  async (c) => {
    try {
      const user = c.get("user") as ParsedToken | null;
      if (!user) return c.json({ error: "Unauthorized" }, 401);
      const projectId = await db.getDefaultProjectId(user.userId);
      if (!projectId) return c.json([]);
      return c.json(await db.findDataSourcesByProjectId(projectId));
    } catch (err) {
      logger.error("DataSources index error", err instanceof Error ? err : undefined);
      return c.json({ error: "Internal error" }, 500);
    }
  },
);

// ─── Get :id ─────────────────────────────────────────────────────────────────

router.get(
  "/:id",
  describeRoute({
    description: "Get a single data source by id",
    responses: { ...R[200]("Data source", dataSourceSchema), 404: R[404], 500: R[500] },
  }),
  zValidator("param", detailSchema),
  async (c) => {
    try {
      const { id } = c.req.valid("param");
      const result = await db.findDataSourceById(id);
      if (!result) return c.json({ error: "Not Found" }, 404);
      return c.json(result);
    } catch (e) {
      logger.error("DataSource get error", e instanceof Error ? e : undefined);
      return c.json({ error: "Internal error" }, 500);
    }
  },
);

// ─── Create ───────────────────────────────────────────────────────────────────

router.post(
  "/",
  describeRoute({
    description: "Create a new data source in the user's default project",
    responses: { ...R[201]("Created data source", dataSourceSchema), 401: R[401], 500: R[500] },
  }),
  requireUser,
  zValidator("json", createSchema),
  async (c) => {
    try {
      const user = c.get("user") as ParsedToken;
      const body = c.req.valid("json");
      const projectId = await db.getDefaultProjectId(user.userId);
      if (!projectId) return c.json({ error: "No project found for user" }, 500);
      const result = await db.createDataSource({ projectId, data: body.data, ...body });
      logger.info("DataSource created", { id: result.id, userId: user.userId });
      return c.json(result, 201);
    } catch (e) {
      logger.error("DataSource create error", e instanceof Error ? e : undefined);
      return c.json({ error: "Internal error" }, 500);
    }
  },
);

// ─── Update :id ───────────────────────────────────────────────────────────────

router.put(
  "/:id",
  describeRoute({
    description: "Update a data source",
    responses: { ...R[200]("Updated data source", dataSourceSchema), 401: R[401], 404: R[404], 500: R[500] },
  }),
  requireUser,
  zValidator("param", detailSchema),
  zValidator("json", updateSchema),
  async (c) => {
    try {
      const user = c.get("user") as ParsedToken;
      const { id } = c.req.valid("param");
      const body = c.req.valid("json");
      const ds = await db.findDataSourceById(id);
      if (!ds) return c.json({ error: "Not Found" }, 404);
      const allowed = await db.canUserModifyProject(user.userId, ds.projectId);
      if (!allowed) return c.json({ error: "Not Authorized" }, 401);
      return c.json(await db.updateDataSource(id, body));
    } catch (e) {
      logger.error("DataSource update error", e instanceof Error ? e : undefined);
      return c.json({ error: "Internal error" }, 500);
    }
  },
);

// ─── Delete :id ───────────────────────────────────────────────────────────────

router.delete(
  "/:id",
  describeRoute({
    description: "Delete a data source",
    responses: { 204: R[204], 401: R[401], 404: R[404], 500: R[500] },
  }),
  requireUser,
  zValidator("param", detailSchema),
  async (c) => {
    try {
      const user = c.get("user") as ParsedToken;
      const { id } = c.req.valid("param");
      const ds = await db.findDataSourceById(id);
      if (!ds) return c.json({ error: "Not Found" }, 404);
      const allowed = await db.canUserModifyProject(user.userId, ds.projectId);
      if (!allowed) return c.json({ error: "Not Authorized" }, 401);
      await db.deleteDataSource(id);
      logger.info("DataSource deleted", { id, userId: user.userId });
      return c.body(null, 204);
    } catch (e) {
      logger.error("DataSource delete error", e instanceof Error ? e : undefined);
      return c.json({ error: "Internal error" }, 500);
    }
  },
);

// ─── SourceLinks ──────────────────────────────────────────────────────────────

router.get(
  "/:id/links",
  describeRoute({
    description: "List all charts linked to a data source",
    responses: { ...R[200]("Source link list", sourceLinkListSchema), 404: R[404], 500: R[500] },
  }),
  requireUser,
  zValidator("param", detailSchema),
  async (c) => {
    try {
      const { id } = c.req.valid("param");
      const ds = await db.findDataSourceById(id);
      if (!ds) return c.json({ error: "Not Found" }, 404);
      return c.json(await db.findSourceLinksByDataSource(id));
    } catch (e) {
      logger.error("SourceLinks list error", e instanceof Error ? e : undefined);
      return c.json({ error: "Internal error" }, 500);
    }
  },
);

router.post(
  "/:id/links",
  describeRoute({
    description: "Link a chart to a data source",
    responses: { ...R[201]("Created source link", sourceLinkSchema), 401: R[401], 404: R[404], 500: R[500] },
  }),
  requireUser,
  zValidator("param", detailSchema),
  zValidator("json", linkSchema),
  async (c) => {
    try {
      const user = c.get("user") as ParsedToken;
      const { id: dataSourceId } = c.req.valid("param");
      const { chartId, config } = c.req.valid("json");
      const ds = await db.findDataSourceById(dataSourceId);
      if (!ds) return c.json({ error: "Not Found" }, 404);
      const allowed = await db.canUserModifyProject(user.userId, ds.projectId);
      if (!allowed) return c.json({ error: "Not Authorized" }, 401);
      const result = await db.createSourceLink(dataSourceId, chartId, config);
      return c.json(result, 201);
    } catch (e) {
      logger.error("SourceLink create error", e instanceof Error ? e : undefined);
      return c.json({ error: "Internal error" }, 500);
    }
  },
);

router.delete(
  "/:id/links/:chartId",
  describeRoute({
    description: "Remove a chart-datasource link",
    responses: { 204: R[204], 401: R[401], 404: R[404], 500: R[500] },
  }),
  requireUser,
  async (c) => {
    try {
      const user = c.get("user") as ParsedToken;
      const dataSourceId = c.req.param("id");
      const chartId = c.req.param("chartId");
      const ds = await db.findDataSourceById(dataSourceId);
      if (!ds) return c.json({ error: "Not Found" }, 404);
      const allowed = await db.canUserModifyProject(user.userId, ds.projectId);
      if (!allowed) return c.json({ error: "Not Authorized" }, 401);
      await db.deleteSourceLink(dataSourceId, chartId);
      return c.body(null, 204);
    } catch (e) {
      logger.error("SourceLink delete error", e instanceof Error ? e : undefined);
      return c.json({ error: "Internal error" }, 500);
    }
  },
);

export default router;
