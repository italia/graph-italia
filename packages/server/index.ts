import { Hono } from "hono";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
// Routes
import authRoutes from "./routes/auth.ts";
import apiKeyRoutes from "./routes/apikeys.ts";
import chartRoutes from "./routes/charts.ts";
import dashRoutes from "./routes/dashboards.ts";
import dataSourceRoutes from "./routes/datasources.ts";
import suggestionsRoutes from "./routes/hints.ts";
import kpiGroupRoutes from "./routes/kpi-group.ts";
import orgRoutes from "./routes/orgs.ts";
import projectRoutes from "./routes/projects.ts";

// Observability
import { httpLogger, logStartup, logger } from "./lib/logger.ts";
import { metricsMiddleware, metricsRouter } from "./lib/metrics.ts";

import { openAPIRouteHandler } from "hono-openapi"
import { Scalar } from "@scalar/hono-api-reference";

const HOST = process.env.HOST || "http://localhost";
const PORT = process.env.PORT || 3003;
const whitelist = process.env.DOMAINS?.split(",") || [
	"localhost",
	HOST,
	`${HOST}:${PORT}`,
	"localhost:3000",
	"http://localhost:3000",
	"http://127.0.0.1:3000",
];
const ROUTES_PREFIX = process.env.ROUTES_PREFIX || "";
const isDev = process.env.NODE_ENV !== "production";

// Build info for healthcheck (injected at build time)
const BUILD_SHA = process.env.BUILD_SHA || "unknown";
const BUILD_TIME = process.env.BUILD_TIME || "unknown";


// Main app with base path
const app = ROUTES_PREFIX
	? new Hono().basePath(ROUTES_PREFIX)
	: new Hono();

// ═══════════════════════════════════════════════════════════════════════════════
// 🔧 MIDDLEWARE STACK
// ═══════════════════════════════════════════════════════════════════════════════

// Prometheus metrics collection (before other middleware)
app.use("*", metricsMiddleware);

// Structured JSON logging (skips healthchecks)
app.use("*", httpLogger);

// CSRF protection
app.use(
	csrf({
		origin: isDev
			? ["http://localhost:3000", "http://localhost:3003", ...whitelist]
			: process.env.HOST,
	}),
);

if (isDev) {
	// CORS CRUD (only in dev)
	app.use(
		"/*",
		cors({
			origin: whitelist,
			credentials: true,
			allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
			allowHeaders: ["Content-Type", "Authorization"],
		}),
	);
}

// CORS — only for public chart/dashboard show and embed endpoints
const publicCors = cors({
	origin: "*",
	allowMethods: ["GET", "OPTIONS"],
	allowHeaders: ["Content-Type", "Authorization"],
});

// app.use(`/*`, publicCors);
app.use(`/charts/show/*`, publicCors);
app.use(`/dashboards/show/*`, publicCors);
// app.use(`${ROUTES_PREFIX}/charts/show/*`, publicCors);
// app.use(`${ROUTES_PREFIX}/dashboards/show/*`, publicCors);

// ═══════════════════════════════════════════════════════════════════════════════
// 🛣️ ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

// Health check endpoint (minimal response for k8s liveness probes)
app.get("/", (c) => c.json({
	status: "ok",
	isDev: isDev,
	version: {
		sha: BUILD_SHA,
		buildTime: BUILD_TIME
	}
}));

// Deep health check for k8s readiness probes (verifies database connection)
app.get("/health/ready", async (c) => {
	try {
		// Import prisma here to test if the client works
		const { prisma } = await import("./lib/db/prisma.ts");

		// Execute a simple query to verify database connection
		await prisma.$queryRaw`SELECT 1`;

		return c.json({
			status: "ready",
			isDev: isDev,
			routes_prefix: ROUTES_PREFIX,
			database: "connected",
			version: {
				sha: BUILD_SHA,
				buildTime: BUILD_TIME
			}
		});
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : "Unknown error";
		logger.error("Health check failed: database connection error", { error: errorMessage });

		return c.json({
			status: "not_ready",
			database: "disconnected",
			error: errorMessage,
			version: {
				sha: BUILD_SHA,
				buildTime: BUILD_TIME
			}
		}, 503);
	}
});



// API routes
app.route("/auth", authRoutes);
app.route("/api-keys", apiKeyRoutes);
app.route("/charts", chartRoutes);
app.route("/charts/kpi-group", kpiGroupRoutes);
app.route("/dashboards", dashRoutes);
app.route("/datasources", dataSourceRoutes);
app.route("/hints", suggestionsRoutes);
app.route("/orgs", orgRoutes);
app.route("/projects", projectRoutes);

app.get("/openapi.json", openAPIRouteHandler(app, {
	documentation: {
		info: {
			title: "Dataviz API",
			version: "1.0.0",
			description: "API documentation for the Dataviz application"
		},
		components: {
			securitySchemes: {
				// cookieSchema: {
				// 	type: "apiKey",
				// 	in: "cookie",
				// 	name: "access_token",
				// },
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				}
			},
		},
		security: [
			{
				bearerAuth: [],
			},
		],
		servers: [
			{
				url: "http://localhost:3000",
				description: "Local server",
			},
			{
				url: "http://dataviz-test.innovazione.gov.it",
				description: "Staging server",
			},
			{
				url: "http://dataviz.innovazione.gov.it",
				description: "Production server",
			},

		],
	}
}));

app.get(
	"/docs",
	Scalar({
		theme: "saturn",
		url: `${ROUTES_PREFIX}/openapi.json`,
	})
);
// ═══════════════════════════════════════════════════════════════════════════════
// ❌ ERROR HANDLING
// ═══════════════════════════════════════════════════════════════════════════════

app.notFound((c) => {
	const requestId = c.get("requestId") || "unknown";
	logger.warn(`Route not found: ${c.req.method} ${c.req.path}`, { requestId });
	return c.json(
		{
			error: "Not Found",
			path: c.req.path,
			requestId,
		},
		404,
	);
});

app.onError((err, c) => {
	const requestId = c.get("requestId") || "unknown";
	logger.error(`Unhandled error: ${err.message}`, err, { requestId });
	return c.json(
		{
			error: "Internal Server Error",
			message: isDev ? err.message : "Something went wrong",
			requestId,
		},
		500,
	);
});

// ═══════════════════════════════════════════════════════════════════════════════
// 📊 METRICS ENDPOINT (outside of ROUTES_PREFIX)
// ═══════════════════════════════════════════════════════════════════════════════
let rootApp: Hono;



if (ROUTES_PREFIX) {
	// Create a separate app for metrics (no auth, no prefix)
	rootApp = new Hono();
	// Mount metrics at /metrics (outside of /api prefix)
	rootApp.route("/metrics", metricsRouter);
	// Mount the main app
	rootApp.route("/", app);

} else {
	// If no ROUTES_PREFIX, use the main app as root
	app.route("/metrics", metricsRouter);
	rootApp = app;
}



// ═══════════════════════════════════════════════════════════════════════════════
// 🚀 SERVER STARTUP
// ═══════════════════════════════════════════════════════════════════════════════

// Log startup info
logStartup();

const server = {
	port: PORT,
	fetch: rootApp.fetch,
};

export default server;
