import { prisma } from "./prisma";
import type { ProjectRole } from "./prisma/client";

// ─── Projects ─────────────────────────────────────────────────────────────────

export function findProjectsByUserId(userId: string) {
  return prisma.project.findMany({
    where: {
      OR: [
        { ownerId: userId },
        { members: { some: { userId } } },
        { orgs: { some: { org: { members: { some: { userId } } } } } },
      ],
    },

    include: {
      members: { include: { user: { select: { id: true, email: true } } } },
      orgs: { include: { org: { select: { id: true, name: true } } } },
    },
    orderBy: { createdAt: "asc" },
  });
}

export function findPersonalProjectsByUserId(userId: string) {
  return prisma.project.findMany({
    where: {
      ownerId: userId,
      orgs: { none: {} },
    },
    include: {
      members: { include: { user: { select: { id: true, email: true } } } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export function findProjectsByOrgId(orgId: string) {
  return prisma.project.findMany({
    where: {
      orgs: { some: { orgId } },
    },
    include: {
      owner: { select: { id: true, email: true } },
      members: { include: { user: { select: { id: true, email: true } } } },
      orgs: { include: { org: { select: { id: true, name: true } } } },
    },
    orderBy: { updatedAt: "desc" },
  });
}


export function findProjectById(id: string) {
  return prisma.project.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, email: true } },
      members: { include: { user: { select: { id: true, email: true } } } },
      orgs: { include: { org: { select: { id: true, name: true } } } },
    },
  });
}

export async function createProject(userId: string, name: string) {
  return prisma.$transaction(async (tx) => {
    const project = await tx.project.create({
      data: { name, ownerId: userId },
    });
    await tx.projectMember.create({
      data: { userId, projectId: project.id, role: "ADMIN" },
    });
    return project;
  });
}

export function updateProject(id: string, name: string) {
  return prisma.project.update({ where: { id }, data: { name } });
}

export function deleteProject(id: string) {
  return prisma.project.delete({ where: { id } });
}

export async function isProjectOwner(userId: string, projectId: string): Promise<boolean> {
  const p = await prisma.project.findUnique({ where: { id: projectId }, select: { ownerId: true } });
  return p?.ownerId === userId;
}

// ─── ProjectMember ────────────────────────────────────────────────────────────

export function findProjectMembers(projectId: string) {
  return prisma.projectMember.findMany({
    where: { projectId },
    include: { user: { select: { id: true, email: true, role: true } } },
  });
}

export function addProjectMember(projectId: string, userId: string, role: ProjectRole = "USER") {
  return prisma.projectMember.create({ data: { projectId, userId, role } });
}

export function updateProjectMemberRole(projectId: string, userId: string, role: ProjectRole) {
  return prisma.projectMember.update({
    where: { userId_projectId: { userId, projectId } },
    data: { role },
  });
}

export function removeProjectMember(projectId: string, userId: string) {
  return prisma.projectMember.delete({ where: { userId_projectId: { userId, projectId } } });
}

// ─── OrgProject ───────────────────────────────────────────────────────────────

export function associateOrgWithProject(projectId: string, orgId: string) {
  return prisma.orgProject.create({ data: { projectId, orgId } });
}

export function removeOrgFromProject(projectId: string, orgId: string) {
  return prisma.orgProject.delete({ where: { orgId_projectId: { orgId, projectId } } });
}
