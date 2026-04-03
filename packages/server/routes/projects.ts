import { Hono } from "hono";
import * as z from "zod";
import { validator as zValidator } from "hono-openapi";
import db from "../lib/db";
import { checkAuth, requireUser } from "../lib/middlewares";
import { logger } from "../lib/logger";
import type { ParsedToken } from "../types";

type Env = { Variables: { user: ParsedToken | null; token: string | undefined } };

const router = new Hono<Env>();
router.use("*", checkAuth, requireUser);

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

/** GET / — all projects the current user is owner or member of */
router.get("/", async (c) => {
  try {
    const user = c.get("user") as ParsedToken;
    return c.json(await db.findProjectsByUserId(user.userId));
  } catch (e) {
    logger.error("Projects index error", e instanceof Error ? e : undefined);
    return c.json({ error: "Internal error" }, 500);
  }
});


/** GET /personal — all personal projects (not associated with any org) */
router.get("/personal", async (c) => {
  try {
    const user = c.get("user") as ParsedToken;
    return c.json(await db.findPersonalProjectsByUserId(user.userId));
  } catch (e) {
    logger.error("Projects personal error", e instanceof Error ? e : undefined);
    return c.json({ error: "Internal error" }, 500);
  }
});


// ─── Get :projectId ───────────────────────────────────────────────────────────

router.get("/:projectId", zValidator("param", projectIdSchema), async (c) => {
  try {
    const user = c.get("user") as ParsedToken;
    const { projectId } = c.req.valid("param");
    const project = await db.findProjectById(projectId);
    if (!project) return c.json({ error: "Not Found" }, 404);
    // visible to owner, members, or members of associated orgs
    const isMember = project.members.some((m) => m.userId === user.userId);
    const isOwner = project.ownerId === user.userId;
    if (!isOwner && !isMember) return c.json({ error: "Not Authorized" }, 401);
    return c.json(project);
  } catch (e) {
    logger.error("Project get error", e instanceof Error ? e : undefined);
    return c.json({ error: "Internal error" }, 500);
  }
});

// ─── Create ───────────────────────────────────────────────────────────────────

/** POST / — creates a new project (user becomes owner + ADMIN member automatically) */
router.post("/", zValidator("json", createProjectSchema), async (c) => {
  try {
    const user = c.get("user") as ParsedToken;
    const { name } = c.req.valid("json");
    const project = await db.createDefaultProject(user.userId);
    // rename if a custom name was provided
    const result = name !== "Default Project"
      ? await db.updateProject(project.id, name)
      : project;
    logger.info("Project created", { projectId: result.id, userId: user.userId });
    return c.json(result, 201);
  } catch (e) {
    logger.error("Project create error", e instanceof Error ? e : undefined);
    return c.json({ error: "Internal error" }, 500);
  }
});

// ─── Update :projectId ────────────────────────────────────────────────────────

router.put("/:projectId", zValidator("param", projectIdSchema), zValidator("json", updateProjectSchema), async (c) => {
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
});

// ─── Delete :projectId ────────────────────────────────────────────────────────

/** DELETE — owner only */
router.delete("/:projectId", zValidator("param", projectIdSchema), async (c) => {
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
});

// ─── Members ──────────────────────────────────────────────────────────────────

/** GET /:projectId/members */
router.get("/:projectId/members", zValidator("param", projectIdSchema), async (c) => {
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
});

/** POST /:projectId/members — add a user (ADMIN or owner only) */
router.post("/:projectId/members", zValidator("param", projectIdSchema), zValidator("json", addMemberSchema), async (c) => {
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
});

/** PUT /:projectId/members/:userId — change role (ADMIN or owner) */
router.put("/:projectId/members/:userId", zValidator("param", memberIdSchema), zValidator("json", updateRoleSchema), async (c) => {
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
});

/** DELETE /:projectId/members/:userId — remove member (ADMIN or owner) */
router.delete("/:projectId/members/:userId", zValidator("param", memberIdSchema), async (c) => {
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
});

// ─── Org associations ─────────────────────────────────────────────────────────

/** POST /:projectId/orgs — associate an org with the project (ADMIN or owner) */
router.post("/:projectId/orgs", zValidator("param", projectIdSchema), zValidator("json", addOrgSchema), async (c) => {
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
});

/** DELETE /:projectId/orgs/:orgId — remove org association (owner only) */
router.delete("/:projectId/orgs/:orgId", zValidator("param", orgIdSchema), async (c) => {
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
});

export default router;
