# graph-italia-server

The backend API for Graph Italia: authentication, project/org management, and CRUD + publishing for charts, dashboards, and data sources. It's what `packages/webapp` talks to, what `packages/client` is generated from, and what the `ChartProvider`/`DashboardProvider`/`DashboardGridProvider` components in `packages/components` fetch from at runtime.

## Stack

| Layer | Choice |
|---|---|
| Runtime | [Bun](https://bun.sh) — no separate build/transpile step, `bun index.ts` runs the TypeScript directly |
| Web framework | [Hono](https://hono.dev/) |
| Database | PostgreSQL, via [Prisma](https://www.prisma.io/) v7 (`@prisma/adapter-pg`); generated client at `lib/db/prisma/` |
| Auth | JWT (`jsonwebtoken`) for user sessions, `bcrypt` for password hashing, plus `dv_`-prefixed API keys for machine access |
| Validation | Zod, via `@hono/zod-validator` / `@hono/standard-validator` |
| API docs | [`hono-openapi`](https://github.com/rhinobase/hono-openapi) (spec generation) + [Scalar](https://scalar.com/) (docs UI) |
| Rate limiting | `hono-rate-limiter`, keyed by client IP |
| Observability | Pino (structured JSON logs), hand-rolled Prometheus-format metrics (`lib/metrics.ts` — no `prom-client` dependency, for Bun compatibility) |
| Email | [Resend](https://resend.com/) (activation, password reset) |
| AI | OpenAI (`openai` SDK) for chart hints — see `routes/hints.ts` |
| File storage | AWS S3 (`@aws-sdk/client-s3`), for CSV/data source uploads |
| Security headers | `helmet` |
| Tests | Bun's built-in test runner (`bun test`), Prisma and external services mocked with `mock.module(...)` — no real DB in tests |

## How it works

`index.ts` builds a single Hono app and layers on a middleware stack, in order: CORS → Prometheus metrics collection → Pino request logging → API-key usage logging → rate limiting (global 200 req/min by IP, plus a stricter 10 req/min on `/auth/*`) → CSRF protection. Routes are mounted after that stack, each route file wiring its own auth guards on top.

**Auth resolution** (`lib/middlewares.ts`, `checkAuth`) reads a credential from the `access_token` cookie or an `Authorization: Bearer` header — never both required, cookie wins if present. A token starting with `dv_` is looked up as an API key; anything else is verified as a session JWT. An invalid/expired/revoked credential just resolves to "anonymous" (never throws), so public endpoints keep working — protected routes enforce further down the chain via `requireUser` (session only), `requireAuth` (session **or** API key, and resolves `projectId` into the request context), or `requireAdmin`.

**Multi-tenancy**: almost everything is scoped to a `Project`. A session user's requests resolve a project via the `x-project-id` header (validated against membership) or fall back to their oldest owned/member project; an API-key request is scoped to whatever project the key was created for. `canRead`/`canModify` helpers in `middlewares.ts` enforce read vs. write access per project, respecting API key `READONLY`/`READWRITE` roles.

**Data model**: `User` → owns/joins `Project`s (optionally grouped under an `Org`) → each `Project` holds `Chart`s, `Dashboard`s (composed of `Slot`s linking charts into a layout), `DataSource`s (CSV or remote URL, linked to charts via `SourceLink`), and `ApiKey`s. See `prisma/schema.prisma` for the full schema and `prisma/migrations/` for history.

**Publishing**: a `Chart`/`Dashboard` flagged `publish: true` is servable, unauthenticated, from its public `show` endpoint (CORS-open) — this is what backs `<iframe>` embeds and the `graph-italia-components` fetch-and-render providers.

## API docs

The OpenAPI 3.0 spec is generated live from the route definitions (`describeRoute()` calls in each `routes/*.ts` file) — it isn't a static file you edit, it's derived from the running server:

- Spec (JSON): `GET /openapi.json` → [`index.ts:183`](index.ts#L183)
- Interactive docs (Scalar UI): `GET /docs` → [`index.ts:227`](index.ts#L227)

With the default `ROUTES_PREFIX=/api` (see `sample.env`) and the server on port 3003, that's `http://localhost:3003/api/docs` locally.

A point-in-time snapshot of this spec (exported and converted to YAML) lives in [`../client/graphitalia-openapi.json`](../client/graphitalia-openapi.json) / [`../client/graphitalia-openapi.yml`](../client/graphitalia-openapi.yml) — that's the input Orval reads to regenerate the typed `packages/client` SDK. If you change a route's schema here, re-export the spec and regenerate the client (see `packages/client/README.md`'s "Regenerating the client" section) so the two don't drift.

## Main routes

All paths below are relative to `ROUTES_PREFIX` (`/api` by default). Auth column: **public** = no credential needed, **session** = JWT only (`requireUser`), **session|key** = JWT or API key (`requireAuth`, project-scoped, `READWRITE` needed for writes), **admin** = session with `ADMIN` role.

| Mount | File | Auth | Purpose |
|---|---|---|---|
| `/auth/*` | `routes/auth.ts` | mixed | Register, login, logout, email verification (PIN + link), password recovery/reset, resend verification, `GET /auth/user` (current session). Rate-limited to 10 req/min. |
| `/apikeys` | `routes/apikeys.ts` | session | Create/list/revoke/reinstate API keys for the caller's projects, view per-key usage logs. |
| `/charts` | `routes/charts.ts` | session\|key (public for `/charts/show/:id`) | CRUD for charts, publish toggle, `GET /charts/show/:id` (public, published-only). |
| `/charts/kpi-group` | `routes/kpi-group.ts` | session\|key (create is session-only) | KPI-group chart CRUD — a chart made of multiple KPI tiles sharing one data source. |
| `/dashboards` | `routes/dashboards.ts` | session\|key (public for `/dashboards/show/:id`) | CRUD for dashboards, slot layout updates, `GET /dashboards/show/:id` (public, published-only). |
| `/datasources` | `routes/datasources.ts` | session\|key | CRUD for data sources (CSV/remote URL), link/unlink charts to a data source. |
| `/hints` | `routes/hints.ts` | session | OpenAI-backed chart suggestions from uploaded data. |
| `/orgs` | `routes/orgs.ts` | session | Org CRUD, membership management, org↔project associations. |
| `/projects` | `routes/projects.ts` | session | Project CRUD, membership management. |
| `/admin/*` | `routes/admin.ts` | admin | List/delete users, force-activate a user, resend activation, trigger password reset — admin-only user management. |
| `/oidc/*` (mounted outside `ROUTES_PREFIX`, at `/api/oidc`) | `routes/oidc.ts` | — | OIDC login/callback/logout, work in progress for SPID/CIE-style federated login. |

Plus infrastructure endpoints outside the API surface: `GET /` (liveness), `GET /health/ready` (readiness, checks DB connectivity), `GET /metrics` (Prometheus scrape, mounted outside `ROUTES_PREFIX`).

## Seeds

Scripts under `seeds/`, run with `bun run seeds/<script>.ts` from `packages/server` (or via the root-level shortcuts where noted):

| Script | Purpose |
|---|---|
| `seed-users.ts` | The main dev bootstrap. Idempotently upserts users (creates by email if missing, updates by `id` if given, skips existing emails), verifies every user, and ensures each has a default `Project`. Reads a `SEED_USERS` env var (JSON array of `{id?, email, password, verified?, role?}`) if set, otherwise falls back to one hardcoded default user. Run from the repo root as `bun run seed` (see root `package.json`); this is also what Helm's `db-seed` pre-upgrade hook runs in Kubernetes deploys. |
| `cleanup.ts` | One-off maintenance script: deletes charts created on/after a hardcoded cutoff date. Meant to be edited per use, not run as-is against a database you care about. |
| `generate-sample-chart-data.ts` | Generates fake analytics-style sample data (visitors, sessions, referrers, etc.) — used to seed demo charts, not real usage data. |
| `restore-previous-data.ts` (`bun run restore:data`) | Restores a full backup (users, orgs, projects, memberships, charts, dashboards, slots) from JSON files in `seeds/data/`, in FK-safe order. For disaster recovery / migrating data into a fresh database. |
| `migrate-legacy-projects.ts` | One-time migration for instances upgrading from a pre-multi-tenancy schema: backfills a default `Project` for legacy rows that predate the `Project`/`ProjectMember` model, guarded by a `/tmp/legacy-schema-migrated` marker file so it only runs once. |

## Taking part in development

1. **Branching**: work off `main`, branch as `feature/<name>`. Merge into `develop` first — pushes to `develop` auto-deploy to the `graph-italia-test` environment (`.github/workflows/release.yml`). Once verified there, merge into `main`; production deploys **only** happen from a semantic tag (`git tag -a v1.2.3 -m "..."; git push origin v1.2.3`), never from a bare push to `main`.
2. **Local setup**: see the root [`CLAUDE.md`](../../CLAUDE.md) for the full command reference (`bun run dev:server`, Prisma commands, env vars). Quick path:
   ```bash
   bun install
   cd packages/server
   cp sample.env .env   # then fill in JWT_SECRET, RESEND_API_KEY, OPENAI_API_KEY, DATABASE_URL
   prisma generate
   prisma migrate deploy   # or `prisma db push` for quick prototyping without a migration
   cd ../..
   bun run seed
   bun run dev:server
   ```
3. **Schema changes**: edit `prisma/schema.prisma`, then `prisma migrate dev --name <description>` to create and apply a migration (commit the generated `prisma/migrations/<timestamp>_<description>/` folder), then `prisma generate` to refresh the client types.
4. **Adding/changing a route**: add or edit a file in `routes/`, describe each endpoint with `describeRoute()` + a Zod schema (this is what feeds the OpenAPI spec — see **API docs** above) and validate input with `zValidator`. Wire the right auth middleware (`checkAuth` always first, then `requireUser`/`requireAuth`/`requireAdmin` as appropriate) and mount the router in `index.ts`.
5. **Tests**: `bun test` (from `packages/server`), or `bun test tests/<file>.test.ts` for a single file. Tests build a fresh app via a `buildApp()` helper and call `app.request(...)` directly — Prisma and external services (email, S3, OpenAI) are mocked with `mock.module(...)`, so tests never touch a real database. Add a test alongside your route change in `tests/`.
6. **Before opening a PR**: run `bun test` and, from the repo root, `bun run build` (the CI workflow's own check is a build across all packages, not a full test suite gate at the monorepo root — but server tests are the safety net for backend logic, so don't skip them).

## License

Copyright © 2023-present Presidenza del Consiglio dei Ministri.

Released under the GNU Affero General Public License v3.0 only (SPDX: `AGPL-3.0-only`) — see the `license` field in `package.json` and [`publiccode.yml`](../../publiccode.yml) at the repo root. Graph Italia is developed by the Italian Departimento per la Trasformazione Digitale as part of the [italia](https://github.com/italia) open-source ecosystem.
