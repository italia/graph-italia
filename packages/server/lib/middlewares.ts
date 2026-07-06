import type { Context } from "hono";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { createApiLog, findApiKeyByRawKey } from "./db/apiKeyDb";
import type { ApiKeyRole } from "./db/prisma/enums";
import { canUserModifyProject, getDefaultProjectId } from "./db/projectDb";
import { verifyAccessToken } from "./jwt";
import { logger } from "./logger";

// Resolve the caller (session JWT cookie or "dv_" API key) and attach user/apiKey
// to the context. An invalid / expired / revoked credential is treated as
// ANONYMOUS and NEVER throws — so public endpoints and /auth/login keep working
// even when the browser sends a stale cookie or a client sends a dead API key.
// Protected routes are enforced downstream by requireUser/requireAuth/requireAdmin.
export const checkAuth = createMiddleware(async (c: Context, next) => {
	try {
		// Cookie first, then Authorization: Bearer fallback.
		let accessToken = getCookie(c, "access_token");
		if (!accessToken) {
			const authHeader = c.req.header("Authorization") || "";
			const bearer = authHeader.replace(/^Bearer\s+/, "");
			if (bearer) accessToken = bearer;
		}

		if (accessToken?.startsWith("dv_")) {
			// API key path — accept only a live (non-revoked, non-expired) key.
			let apiKey = await findApiKeyByRawKey(accessToken);
			if (apiKey) {
				const expiresAt = new Date(apiKey.createdAt);
				expiresAt.setDate(expiresAt.getDate() + apiKey.expire); // expire is in days
				if (apiKey.revokedAt || new Date() > expiresAt) apiKey = null;
			}
			c.set("apiKey", apiKey ?? null);
			c.set("user", null);
		} else if (accessToken) {
			// Session JWT path — an unverifiable token just means "anonymous".
			try {
				const payload = verifyAccessToken(accessToken);
				c.set("user", payload);
				c.set("token", accessToken);
			} catch {
				c.set("user", null);
			}
		}
	} catch (error) {
		// Auth *resolution* failure (e.g. DB hiccup on API-key lookup) must not
		// take down the request — fall back to anonymous and let guards decide.
		logger.warn("Auth resolution failed", {
			error: error instanceof Error ? error.message : "Unknown error",
			path: c.req.path,
		});
		c.set("user", null);
		c.set("apiKey", null);
	}

	// Run the handler OUTSIDE the try/catch so genuine handler errors propagate to
	// app.onError as 500 instead of being silently rewritten to 401.
	await next();
});

// Middleware to require authenticated user
export const requireUser = createMiddleware(async (c, next) => {
	const user = c.get("user");
	if (!user) {
		throw new HTTPException(401, { message: "Unauthorized." });
	}
	await next();
});

// Middleware to require an authenticated user with the ADMIN role.
// NOTE: role is read from the (stateless, up-to-24h) token, so a demotion lags
// until the token expires. The durable fix is a server-side token/session
// version checked in checkAuth (tracked as B7 in the auth-hardening plan, which
// needs a User.tokenVersion migration); done there so demotion/deletion/logout
// invalidate outstanding tokens immediately for requireUser too, not just admin.
export const requireAdmin = createMiddleware(async (c, next) => {
	const user = c.get("user") as { userId: string; role?: string } | null;
	if (!user) {
		throw new HTTPException(401, { message: "Unauthorized." });
	}
	if (user.role !== "ADMIN") {
		throw new HTTPException(403, { message: "Forbidden. Admin access required." });
	}
	await next();
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

/**
 * Route-handler helper — read authorization for a project.
 *
 * Read is broader than write: any project member (user) OR any API key scoped to
 * the project (READONLY *or* READWRITE) may read. Use this to gate GET-by-id
 * handlers so they don't leak other tenants' resources, without breaking
 * legitimate read-only callers. Returns false (never throws) for anonymous.
 */
export async function canRead(c: Context, projectId: string): Promise<boolean> {
	const user = c.get("user") as { userId: string } | null;
	const apiKey = c.get("apiKey") as { projectId: string } | null;
	if (user) return canUserModifyProject(user.userId, projectId);
	if (apiKey) return apiKey.projectId === projectId;
	return false;
}
