import { randomBytes } from "crypto";
import { prisma } from "./prisma";
import type { ApiKeyRole } from "./prisma/client";

// ─── ApiKey ───────────────────────────────────────────────────────────────────

export function findApiKeysByProjectId(projectId: string) {
  return prisma.apiKey.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
    include: {
      project: {
        include: {
          owner: { select: { id: true, email: true } },
          orgs: { include: { org: { select: { id: true, name: true } } } },
        },
      },
    },
  });
}

export function findApiKeysByUserId(userId: string) {
  return prisma.apiKey.findMany({
    where: {
      project: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } },
          { orgs: { some: { org: { members: { some: { userId } } } } } },
        ],
      },
    },
    orderBy: { createdAt: "desc" },
    include: {
      project: {
        include: {
          owner: { select: { id: true, email: true } },
          orgs: { include: { org: { select: { id: true, name: true } } } },
        },
      },
    },
  });
}


export function findApiKeyById(id: string) {
  return prisma.apiKey.findUnique({ where: { id } });
}

export function findApiKeyByRawKey(key: string) {
  return prisma.apiKey.findUnique({ where: { key } });
}

export function createApiKey(projectId: string, role: ApiKeyRole = "READONLY", expireDays = 60) {
  const key = `dv_${randomBytes(32).toString("hex")}`;
  return prisma.apiKey.create({
    data: { key, role, expire: expireDays, projectId },
  });
}

export function deleteApiKey(id: string) {
  return prisma.apiKey.delete({ where: { id } });
}

// ─── ApiLog ───────────────────────────────────────────────────────────────────

export function findLogsByApiKey(apiKeyId: string, limit = 100) {
  return prisma.apiLog.findMany({
    where: { apiKeyId },
    orderBy: { timestamp: "desc" },
    take: limit,
  });
}

export function createApiLog(data: {
  apiKeyId: string;
  method: string;
  endpoint: string;
  status: number;
  responseTime: number;
}) {
  return prisma.apiLog.create({ data });
}
