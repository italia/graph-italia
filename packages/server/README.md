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
| `/charts` | `routes/charts.ts` | session\|key (public for `/charts/show/:id`) | CRUD for charts, publish toggle, `GET /charts/show/:id` (public, published-only — 404 when public publishing is off, see below). |
| `/charts/kpi-group` | `routes/kpi-group.ts` | session\|key (create is session-only) | KPI-group chart CRUD — a chart made of multiple KPI tiles sharing one data source. |
| `/dashboards` | `routes/dashboards.ts` | session\|key (public for `/dashboards/show/:id`) | CRUD for dashboards, slot layout updates, `GET /dashboards/show/:id` (public, published-only — 404 when public publishing is off, see below). |
| `/datasources` | `routes/datasources.ts` | session\|key | CRUD for data sources (CSV/remote URL), link/unlink charts to a data source. |
| `/hints` | `routes/hints.ts` | session | OpenAI-backed chart suggestions from uploaded data. |
| `/orgs` | `routes/orgs.ts` | session | Org CRUD, membership management, org↔project associations. |
| `/projects` | `routes/projects.ts` | session | Project CRUD, membership management. |
| `/admin/*` | `routes/admin.ts` | admin | List/delete users, force-activate a user, resend activation, trigger password reset — admin-only user management. |
| `/oidc/*` (mounted outside `ROUTES_PREFIX`, at `/api/oidc`) | `routes/oidc.ts` | — | OIDC login/callback/logout, work in progress for SPID/CIE-style federated login. |

Plus `GET /config` (public: instance settings the webapp needs before login — currently `{ publicPublishing }`), and infrastructure endpoints outside the API surface: `GET /` (liveness), `GET /health/ready` (readiness, checks DB connectivity), `GET /metrics` (Prometheus scrape, mounted outside `ROUTES_PREFIX`).

## Email

Transactional email (account activation, password reset, org invitations) goes through **two interchangeable providers**, picked at runtime by `MAIL_PROVIDER`:

| Provider | File | Configuration |
|---|---|---|
| `resend` (default) | `lib/mailer-resend.ts` | `RESEND_API_KEY` |
| `smtp` | `lib/mailer-smtp.ts` | `SMTP_HOST`, `SMTP_PORT` (587), `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_SECURE` |

`lib/mailer.ts` holds the shared contract (`SendMailArgs`, `SendMailResult`, `maskEmail`) and routes each send to the selected provider; `lib/email.ts` owns the HTML templates and the app-level `sendActivationEmail` / `sendResetPasswordEmail`, and is unaware of which transport runs. Routes import `lib/email.ts` only, so nothing outside these three files changes when the provider does.

The SMTP path is nodemailer against any SMTP connector — Mailgun, Amazon SES or a plain relay all speak it — which is what makes it the provider-independent option. `SENDER_EMAIL` sets the From address for both, and both mask recipients in logs.

Neither provider throws on missing configuration: an unset `RESEND_API_KEY` or `SMTP_HOST` logs a warning and returns an error result, so local development and tests run without email set up. Since a failed send does not block registration, check the logs (`provider`, `duration_ms`, masked `to`) when an account never receives its PIN.

## Public publishing toggle

`ENABLE_PUBLIC_PUBLISHING` (env, defaults to enabled — only the literal `"false"` turns it off) decides whether this instance has a public surface at all. It lives here rather than in the webapp because the API is what enforces it; the webapp reads it from `GET /config` at startup and mirrors it in the UI, so the two can never disagree. `lib/publishing.ts` is the single implementation:

- **`GET /charts/show/:id` and `GET /dashboards/show/:id` answer 404** when it is off, whatever the row's `publish` value — these are the only anonymous read endpoints, so turning them off removes the public surface entirely.
- **Nothing can be flipped to `publish: true`.** `POST /charts/publish/:id` returns 403 when it would publish (un-publishing stays allowed, so an instance that is switched off can always be cleaned up), and create/update on charts, dashboards, KPI groups and data sources are sanitised to `publish: false` rather than rejected, so older clients keep working — they just cannot make anything public.
- **Authenticated reads are untouched.** `GET /charts/:id` and `GET /dashboards/:id` go through `requireAuth` + `canRead` and never look at `publish`, so a session or a project-scoped `dv_` API key reads private charts and dashboards exactly as before. This is how `packages/components` (`ChartProvider`, `DashboardProvider`) consumes them, and it is the intended path on an instance with publishing off.

Note that turning the flag off does not rewrite existing data: rows already at `publish: true` stay that way, they simply stop being reachable anonymously. `Chart`, `Dashboard` and `DataSource` all default to `publish: false`.

## SPID/CIE-only authentication

`ENABLE_PASSWORD_AUTH` (env, defaults to enabled — only the literal `"false"` turns it off) decides whether email/password authentication exists on this instance. Like the publishing toggle, the API enforces it and the webapp mirrors it from `GET /config` (`passwordAuth`). `lib/passwordAuth.ts` is the single implementation:

- **SPID/CIE becomes the only way in.** `POST /auth/register`, `/auth/login`, `/auth/recover`, `/auth/resend`, `/auth/verify`, `/auth/reset-password`, `PUT /auth/pwd` and `GET /auth/confirm/:uid/:code` answer 403, as do the admin `resend-activation` and `reset-password` mailers. `GET /auth/user` and `POST /auth/logout` are shared with the OIDC flow and keep working.
- **Signup goes through OIDC.** With the flag off, `POST /api/oidc/signup` creates the account with `password = null`; with it on, the same endpoint still requires a password, so the account can also sign in with email/password.

## Bootstrap admins

`ADMIN_EMAILS` (comma-separated, case-insensitive) lists emails that receive the `ADMIN` role when they sign in, through SPID/CIE or email/password (`lib/adminEmails.ts`, applied wherever a session is issued). It only grants: removing an email from the list does not demote anyone, so roles changed from the admin panel are never overridden at the next login. It needs no password, unlike the seed script, and also promotes accounts that already exist.

## SPID/CIE account matching

Emails are compared case-insensitively everywhere (`findUserByEmail`) and new accounts are stored lowercased.

Existing rows were lowercased by migration `20261016140000_normalize_user_emails`, except accounts whose emails differ only by case: those are listed in the admin panel ("Duplicate emails", `GET /admin/users/duplicates`) and merged there (`POST /admin/users/merge`, `lib/db/userMergeDb.ts`). The admin picks the account to keep; projects, project/org memberships (higher role wins) and SPID/CIE identities move to it, it inherits verified/ADMIN/password from the merged accounts, and the others are deleted. Once the panel reports no duplicates, a `CHECK (email = lower(email))` constraint can be added in a later migration.

The **email** is what links a SPID/CIE login to an account (`routes/oidc.ts`). Identities live in `OidcIdentity` (one row per `sub`), so the same account can be reached from SPID and from CIE, which issue different subjects.

- **The identity provider sends an email** (IAM Proxy is trusted): `/api/oidc/login` looks the account up by that email — including accounts created with email/password — links the `sub`, marks the account verified and opens the session. With no matching account the user lands on the webapp's `/oidc/signup` with the email locked.
- **No email from the identity provider** (CIE never sends one, SPID not always): an already linked `sub` logs straight in. Otherwise `/oidc/signup` asks for an email and `POST /api/oidc/signup/email/send` mails a 6-digit code; `POST /api/oidc/signup/email/verify` checks it. If the email belongs to an account, the `sub` is linked and the session opens; if not, signup continues with that email. From then on the linked `sub` is enough.
- The code state lives in the signed, short-lived `oidc-email` cookie (`lib/oidcEmailVerification.ts`), bound to the OIDC `sub`, with the PIN stored as an HMAC keyed by `JWT_SECRET`. `POST /api/oidc/signup` never takes the email from its body: it uses the IdP email or the verified one.

### OIDC configuration

`@hono/oidc-auth` reads its configuration from the environment:

| Variable | Notes |
|---|---|
| `OIDC_ISSUER` | Issuer URL (serves `/.well-known/openid-configuration`). Mock: `http://127.0.0.1:9090` |
| `OIDC_CLIENT_ID` / `OIDC_CLIENT_SECRET` | The client is authenticated with `client_secret_basic` only. Mock: `my-client-id` / any value |
| `OIDC_AUTH_SECRET` | At least 32 random characters; signs the `oidc-auth` session cookie |
| `OIDC_REDIRECT_URI` | `<server>/api/oidc/callback` — the library default (`/callback`) does not match our mount |
| `OIDC_SCOPES` | Optional, e.g. `openid profile email`; empty requests every scope the IdP advertises |

`mock-oidc-server.ts` takes `MOCK_OIDC_SUB`, `MOCK_OIDC_EMAIL` and `MOCK_OIDC_NO_EMAIL=true` to exercise the matching cases locally.

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
