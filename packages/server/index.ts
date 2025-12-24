import { Hono } from "hono";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
// Routes
import authRoutes from "./routes/auth.ts";
import chartRoutes from "./routes/charts.ts";
import dashRoutes from "./routes/dashboards.ts";
import suggestionsRoutes from "./routes/hints.ts";

// Observability
import { httpLogger, logStartup, logger } from "./lib/logger.ts";
import { metricsMiddleware, metricsRouter } from "./lib/metrics.ts";

const HOST = process.env.HOST || "http://localhost";
const PORT = process.env.PORT || 3003;
const whitelist = process.env.DOMAINS?.split(",") || [
	"localhost",
	HOST,
	`${HOST}:${PORT}`,
];
const ROUTES_PREFIX = process.env.ROUTES_PREFIX || "";
const isDev = process.env.NODE_ENV !== "production";

// Variables stored in Hono context
type Variables = {
	user: any;
	token: string;
	requestId: string;
};

// Main app with base path
const app = ROUTES_PREFIX
	? new Hono<{ Variables: Variables }>().basePath(ROUTES_PREFIX)
	: new Hono<{ Variables: Variables }>();

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
			? ["http://localhost:4000", "http://localhost:3003", ...whitelist]
			: process.env.HOST,
	}),
);

// CORS (only in dev)
if (isDev) {
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

// ═══════════════════════════════════════════════════════════════════════════════
// 🛣️ ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

// Health check endpoint (minimal response for k8s probes)
app.get("/", (c) => c.json({ status: "ok", message: "^^" }));

// API routes
app.route("/auth", authRoutes);
app.route("/charts", chartRoutes);
app.route("/dashboards", dashRoutes);
app.route("/hints", suggestionsRoutes);

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
let rootApp: Hono<{ Variables: Variables }>;

if (ROUTES_PREFIX) {
	// Create a separate app for metrics (no auth, no prefix)
	rootApp = new Hono<{ Variables: Variables }>();
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
