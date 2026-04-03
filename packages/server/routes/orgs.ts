import { Hono } from "hono";
import * as z from "zod";
import { validator as zValidator, resolver, describeRoute } from "hono-openapi";
import db from "../lib/db";
import { checkAuth, requireUser } from "../lib/middlewares";
import { logger } from "../lib/logger";
import { sendActivationEmail } from "../lib/email";
import { randomBytes } from "crypto";

import type { ParsedToken } from "../types";

type Env = { Variables: { user: ParsedToken | null; token: string | undefined } };

const router = new Hono<Env>();
router.use("*", checkAuth);
router.use("*", requireUser);

const orgIdSchema = z.object({ orgId: z.string() });
const memberIdSchema = z.object({ orgId: z.string(), userId: z.string() });

const createOrgSchema = z.object({ name: z.string() });
const updateOrgSchema = z.object({ name: z.string() });
const addMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(["USER", "ADMIN"]).default("USER"),
});

const updateRoleSchema = z.object({ role: z.enum(["USER", "ADMIN"]) });

const errSchema = z.object({ error: z.string() });
const orgSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
const membershipSchema = z.object({
  userId: z.string(),
  orgId: z.string(),
  role: z.enum(["USER", "ADMIN"]),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// ─── Index ────────────────────────────────────────────────────────────────────

router.get(
  "/",
  describeRoute({
    description: "List all orgs the current user belongs to",
    responses: {
      200: { description: "Org list", content: { "application/json": { schema: resolver(z.array(orgSchema)) } } },
      500: { description: "Internal error", content: { "application/json": { schema: resolver(errSchema) } } },
    },
  }),
  async (c) => {
    try {
      const user = c.get("user") as ParsedToken;
      return c.json(await db.findOrgsByUserId(user.userId));
    } catch (e) {
      logger.error("Orgs index error", e instanceof Error ? e : undefined);
      return c.json({ error: "Internal error" }, 500);
    }
  },
);

// ─── Get :orgId ───────────────────────────────────────────────────────────────

router.get(
  "/:orgId",
  describeRoute({
    description: "Get a single org with its members and associated projects",
    responses: {
      200: { description: "Org detail", content: { "application/json": { schema: resolver(orgSchema) } } },
      401: { description: "Unauthorized", content: { "application/json": { schema: resolver(errSchema) } } },
      404: { description: "Not Found", content: { "application/json": { schema: resolver(errSchema) } } },
      500: { description: "Internal error", content: { "application/json": { schema: resolver(errSchema) } } },
    },
  }),
  zValidator("param", orgIdSchema),
  async (c) => {
    try {
      const user = c.get("user") as ParsedToken;
      const { orgId } = c.req.valid("param");
      const org = await db.findOrgById(orgId);
      if (!org) return c.json({ error: "Not Found" }, 404);
      const isMember = org.members.some((m) => m.userId === user.userId);
      if (!isMember) return c.json({ error: "Not Authorized" }, 401);
      return c.json(org);
    } catch (e) {
      logger.error("Org get error", e instanceof Error ? e : undefined);
      return c.json({ error: "Internal error" }, 500);
    }
  },
);

// ─── Create ───────────────────────────────────────────────────────────────────

router.post(
  "/",
  describeRoute({
    description: "Create a new org. The current user becomes its first ADMIN member.",
    responses: {
      201: { description: "Created org", content: { "application/json": { schema: resolver(orgSchema) } } },
      500: { description: "Internal error", content: { "application/json": { schema: resolver(errSchema) } } },
    },
  }),
  zValidator("json", createOrgSchema),
  async (c) => {
    try {
      const user = c.get("user") as ParsedToken;
      const { name } = c.req.valid("json");
      const org = await db.createOrg(name, user.userId);
      logger.info("Org created", { orgId: org.id, userId: user.userId });
      return c.json(org, 201);
    } catch (e) {
      logger.error("Org create error", e instanceof Error ? e : undefined);
      return c.json({ error: "Internal error" }, 500);
    }
  },
);

// ─── Update :orgId ────────────────────────────────────────────────────────────

router.put(
  "/:orgId",
  describeRoute({
    description: "Rename an org (ADMIN only)",
    responses: {
      200: { description: "Updated org", content: { "application/json": { schema: resolver(orgSchema) } } },
      401: { description: "Unauthorized", content: { "application/json": { schema: resolver(errSchema) } } },
      500: { description: "Internal error", content: { "application/json": { schema: resolver(errSchema) } } },
    },
  }),
  zValidator("param", orgIdSchema),
  zValidator("json", updateOrgSchema),
  async (c) => {
    try {
      const user = c.get("user") as ParsedToken;
      const { orgId } = c.req.valid("param");
      const { name } = c.req.valid("json");
      if (!(await db.isOrgAdmin(user.userId, orgId))) return c.json({ error: "Not Authorized" }, 401);
      return c.json(await db.updateOrg(orgId, name));
    } catch (e) {
      logger.error("Org update error", e instanceof Error ? e : undefined);
      return c.json({ error: "Internal error" }, 500);
    }
  },
);

// ─── Delete :orgId ────────────────────────────────────────────────────────────

router.delete(
  "/:orgId",
  describeRoute({
    description: "Delete an org (ADMIN only)",
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
      const { orgId } = c.req.valid("param");
      if (!(await db.isOrgAdmin(user.userId, orgId))) return c.json({ error: "Not Authorized" }, 401);
      await db.deleteOrg(orgId);
      logger.info("Org deleted", { orgId, userId: user.userId });
      return c.body(null, 204);
    } catch (e) {
      logger.error("Org delete error", e instanceof Error ? e : undefined);
      return c.json({ error: "Internal error" }, 500);
    }
  },
);

// ─── Members ──────────────────────────────────────────────────────────────────

router.get(
  "/:orgId/members",
  describeRoute({
    description: "List members of an org (members only)",
    responses: {
      200: { description: "Member list", content: { "application/json": { schema: resolver(z.array(membershipSchema)) } } },
      401: { description: "Unauthorized", content: { "application/json": { schema: resolver(errSchema) } } },
      500: { description: "Internal error", content: { "application/json": { schema: resolver(errSchema) } } },
    },
  }),
  zValidator("param", orgIdSchema),
  async (c) => {
    try {
      const user = c.get("user") as ParsedToken;
      const { orgId } = c.req.valid("param");
      const membership = await db.findMembership(user.userId, orgId);
      if (!membership) return c.json({ error: "Not Authorized" }, 401);
      const org = await db.findOrgById(orgId);
      return c.json(org?.members ?? []);
    } catch (e) {
      logger.error("Org members list error", e instanceof Error ? e : undefined);
      return c.json({ error: "Internal error" }, 500);
    }
  },
);

router.post(
  "/:orgId/members",
  describeRoute({
    description: "Add a user to an org (ADMIN only)",
    responses: {
      201: { description: "Created membership", content: { "application/json": { schema: resolver(membershipSchema) } } },
      401: { description: "Unauthorized", content: { "application/json": { schema: resolver(errSchema) } } },
      500: { description: "Internal error", content: { "application/json": { schema: resolver(errSchema) } } },
    },
  }),
  zValidator("param", orgIdSchema),
  zValidator("json", addMemberSchema),
  async (c) => {
    try {
      const user = c.get("user") as ParsedToken;
      const { orgId } = c.req.valid("param");
      const { email, role } = c.req.valid("json");
      if (!(await db.isOrgAdmin(user.userId, orgId))) return c.json({ error: "Not Authorized" }, 401);

      let targetUser = await db.findUserByEmail(email);
      if (!targetUser) {
        // Create user with random password
        const password = randomBytes(12).toString("hex") + "A1!";
        targetUser = await db.createUserByEmailAndPassword({ email, password });
        const pin = await db.createCode(targetUser.id);
        await sendActivationEmail(targetUser, pin);
        logger.info("New user created during org invitation", { email, userId: targetUser.id });
      }

      const result = await db.addOrgMember(orgId, targetUser.id, role);
      logger.info("Org member added", { orgId, userId: targetUser.id, email });
      return c.json(result, 201);
    } catch (e) {
      logger.error("Org add member error", e instanceof Error ? e : undefined);
      return c.json({ error: "Internal error" }, 500);
    }
  },
);


router.put(
  "/:orgId/members/:userId",
  describeRoute({
    description: "Update a member's role in an org (ADMIN only)",
    responses: {
      200: { description: "Updated membership", content: { "application/json": { schema: resolver(membershipSchema) } } },
      401: { description: "Unauthorized", content: { "application/json": { schema: resolver(errSchema) } } },
      500: { description: "Internal error", content: { "application/json": { schema: resolver(errSchema) } } },
    },
  }),
  zValidator("param", memberIdSchema),
  zValidator("json", updateRoleSchema),
  async (c) => {
    try {
      const user = c.get("user") as ParsedToken;
      const { orgId, userId } = c.req.valid("param");
      const { role } = c.req.valid("json");
      if (!(await db.isOrgAdmin(user.userId, orgId))) return c.json({ error: "Not Authorized" }, 401);
      return c.json(await db.updateOrgMemberRole(orgId, userId, role));
    } catch (e) {
      logger.error("Org update member role error", e instanceof Error ? e : undefined);
      return c.json({ error: "Internal error" }, 500);
    }
  },
);

router.delete(
  "/:orgId/members/:userId",
  describeRoute({
    description: "Remove a member from an org (ADMIN only)",
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
      const { orgId, userId } = c.req.valid("param");
      if (!(await db.isOrgAdmin(user.userId, orgId))) return c.json({ error: "Not Authorized" }, 401);
      await db.removeOrgMember(orgId, userId);
      logger.info("Org member removed", { orgId, userId });
      return c.body(null, 204);
    } catch (e) {
      logger.error("Org remove member error", e instanceof Error ? e : undefined);
      return c.json({ error: "Internal error" }, 500);
    }
  },
);

export default router;
