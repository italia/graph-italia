import type { Context } from "hono";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { createApiLog, findApiKeyByRawKey } from "./db/apiKeyDb";
import type { ApiKeyRole } from "./db/prisma/enums";
import { canUserModifyProject, getDefaultProjectId } from "./db/projectDb";
import { verifyAccessToken } from "./jwt";
import { logger } from "./logger";

// Middleware to check authentication and attach user to context
export const checkAuth = createMiddleware(async (c: Context, next) => {
	let accessToken: string | undefined;
	try {
		// Try cookie first
		accessToken = getCookie(c, "access_token");

		// Fallback to Bearer token
		if (!accessToken) {
			const authHeader = c.req.header("Authorization") || "";
			const bearer = authHeader.replace(/^Bearer\s+/, "");
			if (bearer) accessToken = bearer;
		}

		if (accessToken) {
			// API keys are prefixed with "dv_"
			if (accessToken.startsWith("dv_")) {
				const apiKey = await findApiKeyByRawKey(accessToken);
				if (!apiKey) {
					throw new HTTPException(401, { message: "Invalid API key" });
				}
				if (apiKey.revokedAt) {
					throw new HTTPException(401, { message: "API key revoked" });
				}
				// Check expiry: expire field is in days from createdAt
				const expiresAt = new Date(apiKey.createdAt);
				expiresAt.setDate(expiresAt.getDate() + apiKey.expire);
				if (new Date() > expiresAt) {
					throw new HTTPException(401, { message: "API key expired" });
				}
				c.set("apiKey", apiKey);
				c.set("user", null);
			} else {
				const payload = verifyAccessToken(accessToken);
				c.set("user", payload);
				c.set("token", accessToken);
			}
		}
		await next();
	} catch (error) {
		if (error instanceof HTTPException) throw error;
		logger.warn("Auth failed", {
			error: error instanceof Error ? error.message : "Unknown error",
			path: c.req.path,
		});
		c.set("user", null);
		throw new HTTPException(401, { message: "Unauthorized" });
	}
});

// Middleware to require authenticated user
export const requireUser = createMiddleware(async (c, next) => {
	try {
		const user = c.get("user");
		if (!user) {
			throw new HTTPException(401, { message: "Unauthorized." });
		}
		await next();
	} catch (error) {
		if (error instanceof HTTPException) throw error;
		throw new HTTPException(401, { message: "Unauthorized." });
	}
});

// Middleware to require either an authenticated user or a valid API key.
// Resolves and sets "projectId" in context:
//   - API key  → apiKey.projectId (already scoped at key creation)
//   - User     → their default project (oldest owned/member project)
export const requireAuth = createMiddleware(async (c, next) => {
	const user = c.get("user") as { userId: string } | null;
	const apiKey = c.get("apiKey") as { projectId: string } | null;

	if (!user && !apiKey) {
		throw new HTTPException(401, { message: "Unauthorized." });
	}

	let projectId: string | null = null;

	if (apiKey) {
		projectId = apiKey.projectId;
	} else if (user) {
		// Priority 1: Explicit project ID from header (for project switching in webapp)
		const headerProjectId = c.req.header("x-project-id");
		if (headerProjectId) {
			const allowed = await canUserModifyProject(user.userId, headerProjectId);
			if (allowed) {
				projectId = headerProjectId;
			}
		}

		// Priority 2: Fallback to default project
		if (!projectId) {
			projectId = await getDefaultProjectId(user.userId);
		}
	}

	c.set("projectId", projectId);
	await next();
});


// Middleware to require a valid API key (any role)
export const requireApiKey = createMiddleware(async (c, next) => {
	const apiKey = c.get("apiKey");
	if (!apiKey) {
		throw new HTTPException(401, { message: "Valid API key required." });
	}
	await next();
});

// Middleware to require a specific API key role (or higher)
// Role hierarchy: READWRITE > READONLY
export const requireApiKeyRole = (requiredRole: ApiKeyRole) =>
	createMiddleware(async (c, next) => {
		const apiKey = c.get("apiKey");
		if (!apiKey) {
			throw new HTTPException(401, { message: "Valid API key required." });
		}
		if (requiredRole === "READWRITE" && apiKey.role !== "READWRITE") {
			throw new HTTPException(403, { message: "API key does not have write access." });
		}
		await next();
	});

// Middleware to log API usage when the request is authenticated via API key.
// Must be registered globally (before routes) so it wraps all handlers.
export const apiKeyUsageLogger = createMiddleware(async (c, next) => {
	const start = Date.now();
	await next();
	const apiKey = c.get("apiKey") as { id: string; prefix: string; project?: { name: string } | null } | null | undefined;
	if (!apiKey) return;
	const responseTime = Date.now() - start;
	try {
		await createApiLog({
			apiKeyId: apiKey.id,
			keyPrefix: apiKey.prefix,
			projectName: apiKey.project?.name ?? undefined,
			method: c.req.method,
			endpoint: c.req.path,
			status: c.res.status,
			responseTime,
		});
	} catch (err) {
		logger.warn("Failed to write API key usage log", {
			error: err instanceof Error ? err.message : "Unknown error",
		});
	}
});

/**
 * Route-handler helper — checks whether the current caller can write to a project.
 *
 * - Authenticated user: must be project owner or ADMIN member.
 * - API key: must have READWRITE role AND be scoped to that exact project.
 *
 * Returns false (never throws) so the caller decides the response shape.
 */
export async function canModify(c: Context, projectId: string): Promise<boolean> {
	const user = c.get("user") as { userId: string } | null;
	const apiKey = c.get("apiKey") as { role: string; projectId: string } | null;
	if (user) return canUserModifyProject(user.userId, projectId);
	if (apiKey) return apiKey.role === "READWRITE" && apiKey.projectId === projectId;
	return false;
}
