import express, { Router } from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as middlewares from "./lib/middlewares.ts";
import authRouter from "./routes/auth.ts";
import chartRouter from "./routes/charts.ts";
import dashRouter from "./routes/dashboards.ts";
import suggestionsRouter from "./routes/hints.ts";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
// import seedUsers from "./seeds/seed-users.ts";

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
  })
);

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Dataviz API",
      version: "0.1.0",
      description: "Api to create and publish simple charts and their data",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Developers Staff",
        url: "https://dataviz.innovazione.gov.it",
        email: "contacts@developers.it",
      },
    },
    servers: [
      {
        url: `${HOST}:${PORT}`,
      },
    ],
  },
  apis: ["./routes/*.ts"],
};

const specs = swaggerJsdoc(options);

app.use(cookieParser());
app.use(middlewares.checkAuth);
app.use(express.json({ limit: UPLOAD_SIZE_LIMIT }));
app.use(`${ROUTES_PREFIX}/auth`, authRouter as Router);
app.use(`${ROUTES_PREFIX}/charts`, chartRouter as Router);
app.use(`${ROUTES_PREFIX}/dashboards`, dashRouter as Router);
app.use(`${ROUTES_PREFIX}/hints`, suggestionsRouter as Router);
app.use(
  `${ROUTES_PREFIX}/docs`,
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
    customCssUrl:
      "https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-newspaper.css",
  })
);
/* OLD DEFAULT ROUTE
app.get('/', (req, res) => {
  res.json('^^');
});

/* SEED
app.get("/seed", (req, res) => {
  const result = seedUsers();
  res.json({ result });
});
*/

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});

export default app;
