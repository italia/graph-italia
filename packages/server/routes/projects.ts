import { Hono } from "hono";
import { describeRoute, resolver, validator as zValidator } from "hono-openapi";
import * as z from "zod";
import db from "../lib/db";
import { checkAuth, requireUser } from "../lib/middlewares";
import { logger } from "../lib/logger";
import type { ParsedToken } from "../types";

type Env = { Variables: { user: ParsedToken | null; token: string | undefined } };

const router = new Hono<Env>();
router.use("*", checkAuth, requireUser);

const errSchema = z.object({ error: z.string() });

const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  ownerId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const memberSchema = z.object({
  userId: z.string(),
  projectId: z.string(),
  role: z.enum(["USER", "ADMIN"]),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const projectIdSchema = z.object({ projectId: z.string() });
const memberIdSchema = z.object({ projectId: z.string(), userId: z.string() });
const orgIdSchema = z.object({ projectId: z.string(), orgId: z.string() });

const createProjectSchema = z.object({ name: z.string() });
const updateProjectSchema = z.object({ name: z.string() });
const addMemberSchema = z.object({
  userId: z.string(),
  role: z.enum(["USER", "ADMIN"]).default("USER"),
});
const updateRoleSchema = z.object({ role: z.enum(["USER", "ADMIN"]) });
const addOrgSchema = z.object({ orgId: z.string() });

// ─── Index ────────────────────────────────────────────────────────────────────

router.get(
  "/",
  describeRoute({
    description: "List all projects the current user owns or is a member of.",
    responses: {
      200: { description: "Project list", content: { "application/json": { schema: resolver(z.array(projectSchema)) } } },
      401: { description: "Unauthorized", content: { "application/json": { schema: resolver(errSchema) } } },
      500: { description: "Internal error", content: { "application/json": { schema: resolver(errSchema) } } },
    },
  }),
  async (c) => {
    try {
      const user = c.get("user") as ParsedToken;
      return c.json(await db.findProjectsByUserId(user.userId));
    } catch (e) {
      logger.error("Projects index error", e instanceof Error ? e : undefined);
      return c.json({ error: "Internal error" }, 500);
    }
  },
);

router.get(
  "/personal",
  describeRoute({
    description: "List projects owned by the current user that are not associated with any org.",
    responses: {
      200: { description: "Personal project list", content: { "application/json": { schema: resolver(z.array(projectSchema)) } } },
      401: { description: "Unauthorized", content: { "application/json": { schema: resolver(errSchema) } } },
      500: { description: "Internal error", content: { "application/json": { schema: resolver(errSchema) } } },
    },
  }),
  async (c) => {
    try {
      const user = c.get("user") as ParsedToken;
      return c.json(await db.findPersonalProjectsByUserId(user.userId));
    } catch (e) {
      logger.error("Projects personal error", e instanceof Error ? e : undefined);
      return c.json({ error: "Internal error" }, 500);
    }
  },
);

// ─── Get :projectId ───────────────────────────────────────────────────────────

router.get(
  "/:projectId",
  describeRoute({
    description: "Get a project by ID. Accessible to the owner and its members.",
    responses: {
      200: { description: "Project detail", content: { "application/json": { schema: resolver(projectSchema) } } },
      401: { description: "Unauthorized", content: { "application/json": { schema: resolver(errSchema) } } },
      404: { description: "Not Found", content: { "application/json": { schema: resolver(errSchema) } } },
      500: { description: "Internal error", content: { "application/json": { schema: resolver(errSchema) } } },
    },
  }),
  zValidator("param", projectIdSchema),
  async (c) => {
    try {
      const user = c.get("user") as ParsedToken;
      const { projectId } = c.req.valid("param");
      const project = await db.findProjectById(projectId);
      if (!project) return c.json({ error: "Not Found" }, 404);
      const isMember = project.members.some((m) => m.userId === user.userId);
      const isOwner = project.ownerId === user.userId;
      if (!isOwner && !isMember) return c.json({ error: "Not Authorized" }, 401);
      return c.json(project);
    } catch (e) {
      logger.error("Project get error", e instanceof Error ? e : undefined);
      return c.json({ error: "Internal error" }, 500);
    }
  },
);

// ─── Create ───────────────────────────────────────────────────────────────────

router.post(
  "/",
  describeRoute({
    description: "Create a new project. The current user becomes owner and ADMIN member automatically.",
    responses: {
      201: { description: "Created project", content: { "application/json": { schema: resolver(projectSchema) } } },
      401: { description: "Unauthorized", content: { "application/json": { schema: resolver(errSchema) } } },
      500: { description: "Internal error", content: { "application/json": { schema: resolver(errSchema) } } },
    },
  }),
  zValidator("json", createProjectSchema),
  async (c) => {
    try {
      const user = c.get("user") as ParsedToken;
      const { name } = c.req.valid("json");
      const project = await db.createProject(user.userId, name);
      logger.info("Project created", { projectId: project.id, userId: user.userId });
      return c.json(project, 201);
    } catch (e) {
      logger.error("Project create error", e instanceof Error ? e : undefined);
      return c.json({ error: "Internal error" }, 500);
    }
  },
);

// ─── Update :projectId ────────────────────────────────────────────────────────

router.put(
  "/:projectId",
  describeRoute({
    description: "Rename a project. Requires ADMIN or owner access.",
    responses: {
      200: { description: "Updated project", content: { "application/json": { schema: resolver(projectSchema) } } },
      401: { description: "Unauthorized", content: { "application/json": { schema: resolver(errSchema) } } },
      500: { description: "Internal error", content: { "application/json": { schema: resolver(errSchema) } } },
    },
  }),
  zValidator("param", projectIdSchema),
  zValidator("json", updateProjectSchema),
  async (c) => {
    try {
      const user = c.get("user") as ParsedToken;
      const { projectId } = c.req.valid("param");
      const { name } = c.req.valid("json");
      const allowed = await db.canUserModifyProject(user.userId, projectId);
      if (!allowed) return c.json({ error: "Not Authorized" }, 401);
      return c.json(await db.updateProject(projectId, name));
    } catch (e) {
      logger.error("Project update error", e instanceof Error ? e : undefined);
      return c.json({ error: "Internal error" }, 500);
    }
  },
);

// ─── Delete :projectId ────────────────────────────────────────────────────────

router.delete(
  "/:projectId",
  describeRoute({
    description: "Delete a project. Owner only.",
    responses: {
      204: { description: "No Content" },
      401: { description: "Unauthorized", content: { "application/json": { schema: resolver(errSchema) } } },
      500: { description: "Internal error", content: { "application/json": { schema: resolver(errSchema) } } },
    },
  }),
  zValidator("param", projectIdSchema),
  async (c) => {
    try {
      const user = c.get("user") as ParsedToken;
      const { projectId } = c.req.valid("param");
      if (!(await db.isProjectOwner(user.userId, projectId))) return c.json({ error: "Not Authorized" }, 401);
      await db.deleteProject(projectId);
      logger.info("Project deleted", { projectId, userId: user.userId });
      return c.body(null, 204);
    } catch (e) {
      logger.error("Project delete error", e instanceof Error ? e : undefined);
      return c.json({ error: "Internal error" }, 500);
    }
  },
);

// ─── Members ──────────────────────────────────────────────────────────────────

router.get(
  "/:projectId/members",
  describeRoute({
    description: "List members of a project. Requires ADMIN or owner access.",
    responses: {
      200: { description: "Member list", content: { "application/json": { schema: resolver(z.array(memberSchema)) } } },
      401: { description: "Unauthorized", content: { "application/json": { schema: resolver(errSchema) } } },
      500: { description: "Internal error", content: { "application/json": { schema: resolver(errSchema) } } },
    },
  }),
  zValidator("param", projectIdSchema),
  async (c) => {
    try {
      const user = c.get("user") as ParsedToken;
      const { projectId } = c.req.valid("param");
      const allowed = await db.canUserModifyProject(user.userId, projectId);
      if (!allowed) return c.json({ error: "Not Authorized" }, 401);
      return c.json(await db.findProjectMembers(projectId));
    } catch (e) {
      logger.error("Project members list error", e instanceof Error ? e : undefined);
      return c.json({ error: "Internal error" }, 500);
    }
  },
);

router.post(
  "/:projectId/members",
  describeRoute({
    description: "Add a user to a project. Requires ADMIN or owner access.",
    responses: {
      201: { description: "Created membership", content: { "application/json": { schema: resolver(memberSchema) } } },
      401: { description: "Unauthorized", content: { "application/json": { schema: resolver(errSchema) } } },
      500: { description: "Internal error", content: { "application/json": { schema: resolver(errSchema) } } },
    },
  }),
  zValidator("param", projectIdSchema),
  zValidator("json", addMemberSchema),
  async (c) => {
    try {
      const user = c.get("user") as ParsedToken;
      const { projectId } = c.req.valid("param");
      const { userId, role } = c.req.valid("json");
      const allowed = await db.canUserModifyProject(user.userId, projectId);
      if (!allowed) return c.json({ error: "Not Authorized" }, 401);
      const result = await db.addProjectMember(projectId, userId, role);
      logger.info("Project member added", { projectId, userId });
      return c.json(result, 201);
    } catch (e) {
      logger.error("Project add member error", e instanceof Error ? e : undefined);
      return c.json({ error: "Internal error" }, 500);
    }
  },
);

router.put(
  "/:projectId/members/:userId",
  describeRoute({
    description: "Change the role of a project member. Requires ADMIN or owner access.",
    responses: {
      200: { description: "Updated membership", content: { "application/json": { schema: resolver(memberSchema) } } },
      401: { description: "Unauthorized", content: { "application/json": { schema: resolver(errSchema) } } },
      500: { description: "Internal error", content: { "application/json": { schema: resolver(errSchema) } } },
    },
  }),
  zValidator("param", memberIdSchema),
  zValidator("json", updateRoleSchema),
  async (c) => {
    try {
      const user = c.get("user") as ParsedToken;
      const { projectId, userId } = c.req.valid("param");
      const { role } = c.req.valid("json");
      const allowed = await db.canUserModifyProject(user.userId, projectId);
      if (!allowed) return c.json({ error: "Not Authorized" }, 401);
      return c.json(await db.updateProjectMemberRole(projectId, userId, role));
    } catch (e) {
      logger.error("Project update member role error", e instanceof Error ? e : undefined);
      return c.json({ error: "Internal error" }, 500);
    }
  },
);

router.delete(
  "/:projectId/members/:userId",
  describeRoute({
    description: "Remove a member from a project. Requires ADMIN or owner access.",
    responses: {
      204: { description: "No Content" },
      401: { description: "Unauthorized", content: { "application/json": { schema: resolver(errSchema) } } },
      500: { description: "Internal error", content: { "application/json": { schema: resolver(errSchema) } } },
    },
  }),
  zValidator("param", memberIdSchema),
  async (c) => {
    try {
      const user = c.get("user") as ParsedToken;
      const { projectId, userId } = c.req.valid("param");
      const allowed = await db.canUserModifyProject(user.userId, projectId);
      if (!allowed) return c.json({ error: "Not Authorized" }, 401);
      await db.removeProjectMember(projectId, userId);
      logger.info("Project member removed", { projectId, userId });
      return c.body(null, 204);
    } catch (e) {
      logger.error("Project remove member error", e instanceof Error ? e : undefined);
      return c.json({ error: "Internal error" }, 500);
    }
  },
);

// ─── Org associations ─────────────────────────────────────────────────────────

router.post(
  "/:projectId/orgs",
  describeRoute({
    description: "Associate an org with a project. Requires ADMIN or owner access.",
    responses: {
      201: { description: "Org associated", content: { "application/json": { schema: resolver(z.unknown()) } } },
      401: { description: "Unauthorized", content: { "application/json": { schema: resolver(errSchema) } } },
      500: { description: "Internal error", content: { "application/json": { schema: resolver(errSchema) } } },
    },
  }),
  zValidator("param", projectIdSchema),
  zValidator("json", addOrgSchema),
  async (c) => {
    try {
      const user = c.get("user") as ParsedToken;
      const { projectId } = c.req.valid("param");
      const { orgId } = c.req.valid("json");
      const allowed = await db.canUserModifyProject(user.userId, projectId);
      if (!allowed) return c.json({ error: "Not Authorized" }, 401);
      const result = await db.associateOrgWithProject(projectId, orgId);
      logger.info("Org associated with project", { projectId, orgId });
      return c.json(result, 201);
    } catch (e) {
      logger.error("Project associate org error", e instanceof Error ? e : undefined);
      return c.json({ error: "Internal error" }, 500);
    }
  },
);

router.delete(
  "/:projectId/orgs/:orgId",
  describeRoute({
    description: "Remove an org association from a project. Owner only.",
    responses: {
      204: { description: "No Content" },
      401: { description: "Unauthorized", content: { "application/json": { schema: resolver(errSchema) } } },
      500: { description: "Internal error", content: { "application/json": { schema: resolver(errSchema) } } },
    },
  }),
  zValidator("param", orgIdSchema),
  async (c) => {
    try {
      const user = c.get("user") as ParsedToken;
      const { projectId, orgId } = c.req.valid("param");
      if (!(await db.isProjectOwner(user.userId, projectId))) return c.json({ error: "Not Authorized" }, 401);
      await db.removeOrgFromProject(projectId, orgId);
      logger.info("Org removed from project", { projectId, orgId });
      return c.body(null, 204);
    } catch (e) {
      logger.error("Project remove org error", e instanceof Error ? e : undefined);
      return c.json({ error: "Internal error" }, 500);
    }
  },
);

export default router;
