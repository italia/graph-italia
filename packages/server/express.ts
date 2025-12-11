import express, { Router } from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as middlewares from "./lib/middlewares.ts";
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
const UPLOAD_SIZE_LIMIT = process.env.UPLOAD_SIZE_LIMIT || "15mb";
const ROUTES_PREFIX = process.env.ROUTES_PREFIX || "";
const app = express();

app.use(helmet());
app.use(
	cors({
		origin: whitelist,
		credentials: true,
		methods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
	}),
);

app.use(cookieParser());
app.use(middlewares.checkAuth);
app.use(express.json({ limit: UPLOAD_SIZE_LIMIT }));

app.get(["/", `${ROUTES_PREFIX}/`], async (req, res) => {
	res.json({ status: "ok", message: "^^" });
});

app.use(`${ROUTES_PREFIX}/auth`, authRouter as Router);
app.use(`${ROUTES_PREFIX}/charts`, chartRouter as Router);
app.use(`${ROUTES_PREFIX}/dashboards`, dashRouter as Router);
app.use(`${ROUTES_PREFIX}/hints`, suggestionsRouter as Router);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);
app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}...`);
});

export default app;
