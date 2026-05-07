import { createHash, randomBytes } from "node:crypto";
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

function hashKey(rawKey: string): string {
  return createHash("sha256").update(rawKey).digest("hex");
}

export async function findApiKeyByRawKey(rawKey: string) {
  const parts = rawKey.split("_");
  if (parts.length !== 3 || parts[0] !== "dv") return null;
  const prefix = parts[1];
  const apiKey = await prisma.apiKey.findUnique({
    where: { prefix },
    include: { project: { select: { name: true } } },
  });
  if (!apiKey || hashKey(rawKey) !== apiKey.keyHash) return null;
  return apiKey;
}

export async function createApiKey(projectId: string, role: ApiKeyRole = "READONLY", expireDays = 60) {
  const prefix = randomBytes(4).toString("hex");  // 8-char hex, safe to display
  const secret = randomBytes(32).toString("hex"); // 64-char hex, never stored
  const rawKey = `dv_${prefix}_${secret}`;
  const apiKey = await prisma.apiKey.create({
    data: { prefix, keyHash: hashKey(rawKey), role, expire: expireDays, projectId },
  });
  return { ...apiKey, rawKey };
}

export function deleteApiKey(id: string) {
  return prisma.apiKey.delete({ where: { id } });
}

export function revokeApiKey(id: string) {
  return prisma.apiKey.update({ where: { id }, data: { revokedAt: new Date() } });
}

export function reinstateApiKey(id: string) {
  return prisma.apiKey.update({ where: { id }, data: { revokedAt: null } });
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
  projectName?: string;
  keyPrefix?: string;
  method: string;
  endpoint: string;
  status: number;
  responseTime: number;
}) {
  return prisma.apiLog.create({ data });
}
