import { prisma } from "./prisma";
import type { OrgRole } from "./prisma/client";

// ─── Org ──────────────────────────────────────────────────────────────────────

export function findOrgById(id: string) {
  return prisma.org.findUnique({
    where: { id },
    include: {
      members: { include: { user: { select: { id: true, email: true, role: true } } } },
      projects: { include: { project: { select: { id: true, name: true } } } },
    },
  });
}

export function findOrgsByUserId(userId: string) {
  return prisma.org.findMany({
    where: { members: { some: { userId } } },
    include: { members: { include: { user: { select: { id: true, email: true } } } } },
    orderBy: { createdAt: "asc" },
  });
}

export function createOrg(name: string, ownerUserId: string) {
  return prisma.$transaction(async (tx) => {
    const org = await tx.org.create({ data: { name } });
    await tx.membership.create({ data: { orgId: org.id, userId: ownerUserId, role: "ADMIN" } });
    return org;
  });
}

export function updateOrg(id: string, name: string) {
  return prisma.org.update({ where: { id }, data: { name } });
}

export function deleteOrg(id: string) {
  return prisma.org.delete({ where: { id } });
}

// ─── Membership ───────────────────────────────────────────────────────────────

export function findMembership(userId: string, orgId: string) {
  return prisma.membership.findUnique({ where: { userId_orgId: { userId, orgId } } });
}

export function addOrgMember(orgId: string, userId: string, role: OrgRole = "USER") {
  return prisma.membership.create({ data: { orgId, userId, role } });
}

export function updateOrgMemberRole(orgId: string, userId: string, role: OrgRole) {
  return prisma.membership.update({
    where: { userId_orgId: { userId, orgId } },
    data: { role },
  });
}

export function removeOrgMember(orgId: string, userId: string) {
  return prisma.membership.delete({ where: { userId_orgId: { userId, orgId } } });
}

export async function isOrgAdmin(userId: string, orgId: string): Promise<boolean> {
  const m = await prisma.membership.findUnique({
    where: { userId_orgId: { userId, orgId } },
    select: { role: true },
  });
  return m?.role === "ADMIN";
}
