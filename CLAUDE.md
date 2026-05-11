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
bun run build:components     # Build component library only (Rollup, not Vite)
```

### Testing
```bash
# Server (Bun test runner — run from packages/server)
bun test                      # Run all server tests
bun test tests/charts.test.ts # Run a single test file

# Webapp (Vitest — run from packages/webapp or root)
bun run test                  # Run webapp tests once
bun run test:watch            # Watch mode
bun run test:ui               # Vitest UI
```

### Database (run from packages/server)
```bash
prisma generate              # Regenerate Prisma client after schema changes
prisma migrate dev           # Create and apply a new migration
prisma migrate deploy        # Apply pending migrations (production)
prisma db push               # Push schema without migration (dev/prototyping)
prisma studio                # Open Prisma Studio GUI
bun run seed                 # Seed database with test users (run from root)
```

### Initial setup
```bash
bun install
bun i -g prisma@latest
cd packages/server && prisma generate && prisma db push
bun run seed
# Copy sample.env → .env in packages/server (webapp only needs VITE_SERVER_URL)
```

## Architecture

This is a Bun workspace monorepo with four packages:

- **`packages/components`** — Standalone React component library (`graph-italia-components`) published to npm. Contains `RenderChart`, `ChartWrapper`, `DataTable`, `KpiItem`, `ColorSchemeProvider`. Built with Rollup (ESM + CJS output). Consumers must supply React, ECharts, etc. as peer deps.
- **`packages/server`** — Hono + Bun backend API with PostgreSQL via Prisma. Handles auth, charts, dashboards, datasources, KPI groups, organizations, projects, and API keys.
- **`packages/webapp`** — React 19 + Vite SPA. The main user-facing application for building and viewing charts/dashboards.
- **`packages/ui-example-app`** — Minimal Vite demo app showing how to consume `graph-italia-components`.

### Data flow
1. Users authenticate via the server (JWT stored as an `access_token` cookie, 1-day expiry).
2. The webapp fetches/mutates data through the REST API using axios; SWR is used for data fetching in components.
3. The active project ID is persisted in `localStorage` (`currentProjectId`) and sent on every request via the `x-project-id` header. Server falls back to the user's oldest owned/member project if the header is absent.
4. Charts and dashboards are persisted in PostgreSQL; their config/data is stored as JSON columns.
5. Published charts expose a public endpoint — usable standalone or in `<iframe>` embeds.
6. Embedded charts receive theme (light/dark) via URL query params or `postMessage`.

### Server structure (`packages/server`)
- **Framework**: Hono on Bun runtime
- **ORM**: Prisma v7 with `@prisma/adapter-pg`; generated client lives at `lib/db/prisma/`
- **Route files**: `auth`, `charts`, `dashboards`, `datasources`, `kpi-group`, `hints` (OpenAI), `apikeys`, `orgs`, `projects`
- **Middleware stack** (in `index.ts`): Prometheus metrics → Pino logging → API key usage logger → CSRF → CORS (public `*` for chart/dashboard routes; full CRUD CORS only in dev/localhost)
- **Auth middleware** (`lib/middlewares.ts`): `checkAuth` reads the `access_token` cookie or `Authorization: Bearer` header. API keys use the `dv_` prefix; JWTs are plain tokens. Use `requireAuth` on protected routes — it resolves and sets `projectId` in context.
- **Health endpoints**: `GET /` (liveness), `GET /health/ready` (readiness — checks DB connection)
- **Metrics**: Prometheus scrape at `/metrics`, mounted outside `ROUTES_PREFIX`
- **API docs**: OpenAPI 3.0 spec at `/openapi.json`, Scalar UI at `/docs`
- **External services**: Resend (email), OpenAI (AI chart hints), AWS S3 (file uploads)

### Webapp structure (`packages/webapp`)
- **Router**: React Router v7. All routes are defined centrally in `src/router.tsx`; use the `ROUTES` helper object instead of hardcoding path strings.
- **State**: Zustand stores under `src/lib/store/` (user, dashboard, KPI, project, settings); XState (`src/lib/stepMachine.ts`) for chart-creation wizard
- **Pages**: `src/pages/` — `auth/`, `display/` (public view), `embed/` (iframe), `private/` (editor), `utils/`
- **API client**: `src/lib/api.ts` uses axios with a request interceptor that injects `x-project-id` from localStorage
- **Runtime config**: Loads `/config.json` at startup (`main.tsx`) into `window.__ENV__` for Kubernetes ConfigMap support; falls back to `import.meta.env` (from `.env`) for local dev.
- **i18n**: i18next with Italian as the default language
- **Styling**: TailwindCSS v4 + DaisyUI v5

### Testing patterns

**Server tests** (`packages/server/tests/`, Bun test runner):
- Mock Prisma and external services with `mock.module(...)` — tests do **not** hit a real database.
- Build a fresh Hono app via a `buildApp()` helper, then call `app.request(...)` directly.
- JWT auth uses a predictable `test-secret`; API keys use constants prefixed with `dv_`.

**Webapp tests** (`packages/webapp/src/tests/`, Vitest + happy-dom):
- Accessibility tests use `vitest-axe`; setup in `src/tests/setup.ts` extends `expect` with axe matchers.
- A11y tests live in `src/tests/a11y/` and cover WCAG violations at component/page level.

### Environment variables

**packages/server/.env** (copy from `sample.env`)
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

### Key schema models
`User`, `Chart` (type + JSON config + JSON data), `Dashboard`, `Slot` (Chart↔Dashboard junction with custom settings), `DataSource` (CSV or remote URL), `SourceLink` (Chart↔DataSource), `Project`, `ProjectMember`, `Org`, `Membership`, `OrgProject`, `ApiKey` (`dv_`-prefixed, scoped to a project, READONLY or READWRITE role), `Code` (email verification pins).
