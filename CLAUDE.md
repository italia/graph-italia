# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
bun run dev           # Start both server (port 3003) and webapp (port 3000) concurrently
bun run dev:server    # Start only the backend server
bun run dev:webapp    # Start only the frontend webapp

# From packages/server — local OIDC provider for testing the OIDC flow
bun run mock-oidc-server.ts   # Mock IdP on http://127.0.0.1:9090 (auto-login, userinfo with SPID/CIE claims)
                              # MOCK_OIDC_SUB / MOCK_OIDC_EMAIL / MOCK_OIDC_NO_EMAIL=true pick the simulated identity
```

### Building
```bash
bun run build                # Build all packages
bun run build:webapp         # Build webapp only
bun run build:components     # Build component library only (Rollup, not Vite)
```

### Testing
There is no root-level `test` script — tests run per package (`cd` into the package, or use `bun run --filter <pkg> test`).
```bash
# Server (Bun test runner — run from packages/server)
bun test                      # Run all server tests
bun test tests/charts.test.ts # Run a single test file

# Webapp (Vitest — run from packages/webapp)
bun run test                  # Run webapp tests once
bun run test:watch            # Watch mode
bun run test:ui               # Vitest UI
```

### Linting
ESLint flat configs exist in `packages/webapp` and `packages/ui-example-app`, but only `ui-example-app` exposes a script (`bun run lint`). No root-level lint, Prettier, or Biome config.

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

This is a Bun workspace monorepo with five packages:

- **`packages/components`** — Standalone React component library (`graph-italia-components`) published to npm. Contains `RenderChart`, `ChartWrapper`, `DataTable`, `KpiItem`, `ColorSchemeProvider`. Built with Rollup (ESM + CJS output). Consumers must supply React, ECharts, etc. as peer deps.
- **`packages/server`** — Hono + Bun backend API with PostgreSQL via Prisma. Handles auth, charts, dashboards, datasources, KPI groups, organizations, projects, and API keys.
- **`packages/webapp`** — React 19 + Vite SPA. The main user-facing application for building and viewing charts/dashboards.
- **`packages/ui-example-app`** — Minimal Vite demo app showing how to consume `graph-italia-components` (dev on port 3002).
- **`packages/client`** — `graph-italia-cli`. Rollup-built CLI that generates a typed API client from the server's OpenAPI spec via Orval (`bun run generate`, config in `orval.config.ts`); `bun run convert` turns the OpenAPI JSON into YAML.

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
- **Route files**: `admin`, `auth`, `oidc`, `charts`, `dashboards`, `datasources`, `kpi-group`, `hints` (OpenAI), `apikeys`, `orgs`, `projects`
- **Middleware stack** (in `index.ts`): Prometheus metrics → Pino logging → API key usage logger → CSRF → CORS (public `*` for chart/dashboard routes; full CRUD CORS only in dev/localhost)
- **Auth middleware** (`lib/middlewares.ts`): `checkAuth` reads the `access_token` cookie or `Authorization: Bearer` header. API keys use the `dv_` prefix; JWTs are plain tokens. Use `requireAuth` on protected routes — it resolves and sets `projectId` in context. `requireUser` loads the DB user without a project; `requireAdmin` additionally gates admin-only routes. Admins can be bootstrapped with `ADMIN_EMAILS` (`lib/adminEmails.ts`: `withAdminEmails()` runs wherever a session is issued). `routes/admin.ts` (mounted at `/admin`, guarded by `checkAuth → requireUser → requireAdmin`) handles user administration: list/delete users, force-activate an account, resend activation, trigger a password reset, change roles (`PATCH /admin/users/:id/role`; never your own, never the last admin — applies at the target's next sign-in since the role lives in the JWT), and merge accounts whose emails differ only by case (`GET /admin/users/duplicates`, `POST /admin/users/merge`, logic in `lib/db/userMergeDb.ts`: projects, memberships and SPID/CIE identities move to the kept account before the others are deleted — deleting a user cascades to its projects).
- **OIDC auth (SPID/CIE via IAM Proxy Italia)**: `routes/oidc.ts` implements OpenID Connect alongside the email/password flow — both issue the *same* application JWT, and `checkAuth`/`requireAuth` are unchanged. The OIDC routes mount on a separate `oidcApp` at the root (outside `ROUTES_PREFIX`) in `index.ts`: `/api/oidc/login`, `/api/oidc/callback`, `/api/oidc/logout`, plus signup routes `GET /api/oidc/signup/status`, `POST /api/oidc/signup/email/send`, `POST /api/oidc/signup/email/verify` and `POST /api/oidc/signup`. `login`/`callback` use `@hono/oidc-auth`, configured from `OIDC_*` env vars (see below). A **claims hook** queries the provider's `userinfo_endpoint` with the access token for SPID/CIE attributes (notably `fiscal_number`), falling back to ID-token claims.
  - **Account matching is by email.** Identities live in `OidcIdentity` (one row per `sub`; an account can have several, since SPID and CIE issue different subjects). If the IdP sends an email (trusted), login finds the account by email — password accounts included — links the `sub` and marks it verified. If not (CIE never sends one, SPID not always), a linked `sub` logs straight in; otherwise `/oidc/signup` asks for an email and confirms it with a 6-digit code, then links an existing account with that email or creates one. The code state is a signed short-lived `oidc-email` cookie bound to `sub` (`lib/oidcEmailVerification.ts`, PIN stored as HMAC with `JWT_SECRET`). `POST /api/oidc/signup` never takes the email from its body.
  - **SPID/CIE-only mode**: `ENABLE_PASSWORD_AUTH="false"` (`lib/passwordAuth.ts`, default enabled) makes the password endpoints under `/auth` (register, login, recover, resend, verify, confirm, reset-password, pwd) and the admin activation/reset mailers return 403; OIDC signup then creates accounts with `password = null`. `/auth/user` and `/auth/logout` stay available. Exposed to the webapp as `passwordAuth` in `GET /config`, alongside `publicPublishing`.
  - Frontend: `SignIn.tsx` (only the SPID/CIE button when `isPasswordAuthEnabled()` is false), `OidcSignupPage` (`ROUTES.oidcSignup` = `/oidc/signup`) with `OidcEmailVerification` for the code step and `SignUp` in OIDC mode (email read-only), `PasswordAuthGate` on `/verify/:uid`, `/recover-password`, `/change-password`. API helpers in `webapp/src/lib/api.ts`.
- **Emails are case-insensitive**: `findUserByEmail` (login, signup, recovery, resend, org invites, SPID/CIE matching) compares with `mode: "insensitive"`, and `createUserByEmailAndPassword` stores emails lowercased because the `User.email` unique constraint is case-sensitive. Migration `20261016140000_normalize_user_emails` lowercased existing rows except case-duplicates, which are merged from the admin panel; once the panel shows none, a `CHECK (email = lower(email))` constraint can be added.
- **Health endpoints**: `GET /` (liveness), `GET /health/ready` (readiness — checks DB connection)
- **Metrics**: Prometheus scrape at `/metrics`, mounted outside `ROUTES_PREFIX`
- **API docs**: OpenAPI 3.0 spec at `/openapi.json`, Scalar UI at `/docs`
- **External services**: email (Resend or SMTP/nodemailer, selected by `MAIL_PROVIDER` — see `lib/mailer.ts`), OpenAI (AI chart hints), AWS S3 (file uploads)

### Webapp structure (`packages/webapp`)
- **Router**: React Router v7. All routes are defined centrally in `src/router.tsx`; use the `ROUTES` helper object instead of hardcoding path strings.
- **State**: Zustand stores under `src/lib/store/` (user, dashboard, KPI, project, settings); XState (`src/lib/stepMachine.ts`) for chart-creation wizard
- **Pages**: `src/pages/` — `auth/`, `display/` (public view), `embed/` (iframe), `private/` (editor), `utils/`
- **API client**: `src/lib/api.ts` uses axios with a request interceptor that injects `x-project-id` from localStorage
- **Runtime config**: Loads `/config.json` at startup (`main.tsx`) into `window.__ENV__` for Kubernetes ConfigMap support; falls back to `import.meta.env` (from `.env`) for local dev. Then `loadInstanceConfig()` reads the server's `GET /api/config` once, so `isPublishingEnabled()` / `isPasswordAuthEnabled()` are synchronous everywhere (both fail closed if the call fails).
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
MAIL_PROVIDER=           # 'resend' (default) or 'smtp'
RESEND_API_KEY=          # MAIL_PROVIDER=resend
SMTP_HOST=               # MAIL_PROVIDER=smtp (plus SMTP_PORT/USER/PASSWORD/SECURE)
OPENAI_API_KEY=
DOMAINS=                  # CORS whitelist (comma-separated)
ROUTES_PREFIX=/api
PORT=3003
NODE_ENV=development
ENABLE_PUBLIC_PUBLISHING= # 'false' removes the public chart/dashboard surface (default enabled)
ENABLE_PASSWORD_AUTH=     # 'false' = SPID/CIE only, no email/password login or signup (default enabled)
ADMIN_EMAILS=             # comma-separated emails granted ADMIN at sign-in (SPID/CIE or password); only grants, never demotes
OIDC_ISSUER=              # IdP issuer URL (mock: http://127.0.0.1:9090)
OIDC_CLIENT_ID=           # mock: 'my-client-id' (the mock also signs ID tokens with this audience)
OIDC_CLIENT_SECRET=       # client auth is client_secret_basic only
OIDC_AUTH_SECRET=         # >= 32 random chars, signs the oidc-auth session cookie
OIDC_REDIRECT_URI=        # http://127.0.0.1:3003/api/oidc/callback — the library default '/callback' does not match our mount
OIDC_SCOPES=              # optional, e.g. 'openid profile email'; empty = all scopes the IdP advertises
```

**packages/webapp/.env**
```
VITE_SERVER_URL=http://127.0.0.1:3003
```

### Key schema models
`User` (`password` nullable for SPID/CIE-only accounts), `OidcIdentity` (one per OIDC `sub`, many per user), `Chart` (type + JSON config + JSON data), `Dashboard`, `Slot` (Chart↔Dashboard junction with custom settings), `DataSource` (CSV or remote URL), `SourceLink` (Chart↔DataSource), `Project`, `ProjectMember`, `Org`, `Membership`, `OrgProject`, `ApiKey` (`dv_`-prefixed, scoped to a project, READONLY or READWRITE role), `Code` (email verification pins).
