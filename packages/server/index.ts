import { Hono } from "hono";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { logger } from "hono/logger";

import authRouter from "./routes/auth.ts";
import chartRouter from "./routes/charts.ts";
import dashRouter from "./routes/dashboards.ts";
import suggestionsRouter from "./routes/hints.ts";

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
};

const app = new Hono<{ Variables: Variables }>().basePath(ROUTES_PREFIX);

app.use(logger());
// app.use(csrf());
app.use(
	csrf({
		origin: isDev
			? ["http://localhost:4000", "http://localhost:3003"]
			: process.env.HOST,
	}),
);

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

// app.use(cookieParser());
// app.use(middlewares.checkAuth);
// app.use(express.json({ limit: UPLOAD_SIZE_LIMIT }));

app.get(`/`, (c) => c.json({ status: "ok", message: "^^" }));
app.route(`/auth`, authRouter);
app.route(`/charts`, chartRouter);
app.route(`/dashboards`, dashRouter);
app.route(`/hints`, suggestionsRouter);

app.notFound((c) => {
	return c.text("Custom 404 Message", 404);
});
app.onError((err, c) => {
	console.error(`${err}`);
	return c.text("Custom Error Message", 500);
});
// app.onError((errorHandler) => {
// 	console.log(errorHandler.message, errorHandler.cause);
// 	throw new HTTPException(500, errorHandler);
// });

const server = {
	// hostname: process.env.HOST || "0.0.0.0",
	port: PORT,
	fetch: app.fetch,
};
export default server;
