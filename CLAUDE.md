# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
bun run dev           # Start both server (port 3003) and webapp (port 3000) concurrently
bun run dev:server    # Start only the backend server
bun run dev:webapp    # Start only the frontend webapp
```

### Building
```bash
bun run build                # Build all packages
bun run build:webapp         # Build webapp only
bun run build:components     # Build component library only
```

### Database (run from packages/server)
```bash
prisma generate              # Regenerate Prisma client after schema changes
prisma migrate dev           # Create and apply a new migration
prisma migrate deploy        # Apply pending migrations (production)
prisma db push               # Push schema without migration (dev/prototyping)
prisma studio                # Open Prisma Studio GUI
bun seeds/seed-users.ts      # Seed database with test users
```

### Initial setup
```bash
bun install
bun i -g prisma@latest
cd packages/server && prisma generate && prisma db push
bun seeds/seed-users.ts
# Copy sample.env → .env in both packages/server and packages/webapp
```

## Architecture

This is a Bun workspace monorepo with four packages:

- **`packages/components`** — Standalone React component library (`graph-italia-components`) published to npm. Contains `RenderChart`, `ChartWrapper`, `DataTable`, `KpiItem`, `ColorSchemeProvider`. Built with Rollup (ESM + CJS output). Consumers must supply React, ECharts, etc. as peer deps.
- **`packages/server`** — Hono + Bun backend API with PostgreSQL via Prisma. Handles auth, charts, dashboards, datasources, KPI groups, organizations, projects, and API keys.
- **`packages/webapp`** — React 19 + Vite SPA. The main user-facing application for building and viewing charts/dashboards.
- **`packages/ui-example-app`** — Minimal Vite demo app showing how to consume `graph-italia-components`.

### Data flow
1. Users authenticate via the server (JWT stored in session storage).
2. The webapp fetches/mutates data through the REST API using SWR for data fetching.
3. Charts and dashboards are persisted in PostgreSQL; their config/data is stored as JSON columns.
4. Published charts expose a public endpoint — usable standalone or in `<iframe>` embeds.
5. Embedded charts receive theme (light/dark) via URL query params or `postMessage`.

### Server structure (packages/server)
- **Framework**: Hono on Bun runtime
- **ORM**: Prisma v7 with `@prisma/adapter-pg`
- **Route files**: `auth`, `charts`, `dashboards`, `datasources`, `kpi-group`, `hints` (OpenAI), `apikeys`, `orgs`, `projects`
- **Middleware stack** (in `index.ts`): Prometheus metrics → Pino logging → CSRF → CORS → public CORS for chart/dashboard display endpoints
- **External services**: Resend (email), OpenAI (AI chart hints), AWS S3 (file uploads)
- **API docs**: OpenAPI 3.0 spec exposed at `/docs` via Scalar UI

### Webapp structure (packages/webapp)
- **Router**: React Router v7 with protected routes via `ProtectedRoute`
- **State**: Zustand stores under `src/lib/store/` (user, dashboard, KPI, settings); XState for workflows
- **Pages**: `src/pages/` — `auth/`, `display/` (public), `embed/` (iframe), `private/` (editor), `utils/`
- **Runtime config**: Loads `/config.json` at startup for Kubernetes ConfigMap support; falls back to env vars. This allows the same Docker image across environments.
- **i18n**: i18next with Italian as the default language
- **Styling**: TailwindCSS v4 + DaisyUI v5

### Environment variables

**packages/server/.env**
```
DATABASE_URL=postgresql://postgres:postgres@db:5432/postgres
JWT_SECRET=
APP_URL=                  # Frontend URL (used in email links)
RESEND_API_KEY=
OPENAI_API_KEY=
DOMAINS=                  # CORS whitelist (comma-separated)
ROUTES_PREFIX=/api
PORT=3003
NODE_ENV=development
```

**packages/webapp/.env**
```
VITE_SERVER_URL=http://127.0.0.1:3003
```

### Testing
No test framework is currently configured in this repository.

### Key schema models
`User`, `Chart` (type + JSON config + JSON data), `Dashboard`, `Slot` (Chart↔Dashboard junction with custom settings), `DataSource` (CSV or remote URL), `SourceLink` (Chart↔DataSource), `Project`, `Org`, `ApiKey`, `Code` (email verification pins).
