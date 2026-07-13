# graph-italia-webapp

The main user-facing application for Graph Italia: a self-service tool for turning CSV/JSON data (local or remote) into accessible charts and dashboards, and publishing them (as a shareable link or an `<iframe>` embed) on any website. It's the full editor experience — `packages/components` is the rendering engine it (and everyone else) builds on, `packages/server` is the API it talks to.

> [!IMPORTANT]
> **Public "Display"/"Embed" pages are disabled on our hosted instance**, via the `VITE_ENABLE_PUBLIC_PUBLISHING` flag (see **Public publishing toggle** below) — set to `false` on the Graph Italia instance run by the Dipartimento per la Trasformazione Digitale, for legal/data-governance reasons. The `display/*` and `embed/*` routes (and the underlying `publish: true` / public "show" endpoints on `packages/server`) are part of the open source codebase and work normally if you self-host with the flag left at its default (`true`).
>
> On our hosted instance, the only supported way to use Graph Italia today is: **create charts/dashboards in this webapp, then consume them in your own website via `graph-italia-components` (`ChartProvider`/`DashboardProvider`/`DashboardGridProvider`) or `packages/client`, authenticated with a project API key.** See `packages/components/README.md` and `packages/client/README.md` for how that works. If you self-host `packages/server` yourself, the display/embed/public-URL features are available to you by default — this restriction is specific to our deployment, not a limitation of the software.

## Purpose

Graph Italia exists to let non-technical users publish data visualizations on institutional websites without needing a developer for every chart update — upload a CSV or point at a remote data URL, pick a chart type, adjust colors/legends/labels, save, and either embed it via API key or publish it to a public URL. See the repo root [`README.md`](../../README.md) for the full project background and [`publiccode.yml`](../../publiccode.yml) for the public-sector context this was built for.

## Sections of the app

Routes are defined centrally in [`src/router.tsx`](src/router.tsx) (the `ROUTES` helper object — always reference paths through it, not hardcoded strings). At a high level:

| Area | Routes | Purpose |
|---|---|---|
| **Public / landing** | `/`, `/about`, `/quickstart`, `/gdpr`, `/terms-of-service` | Landing page (`Splash`/`about`), a getting-started guide, and legal pages. No auth. |
| **Auth** | `/login`, `/verify/:uid`, `/recover-password`, `/change-password` | Registration/login (`AuthPage`), email PIN verification, password recovery and change. |
| **Private editors** (behind `ProtectedRoute`) | `/private/home`, `/private/edit/chart/:id?`, `/private/edit/kpi/:id?`, `/private/edit/map/:id?`, `/private/edit/dashboard/:id`, `/private/edit/datasource/:id?` | The core editor: home/chart list, and per-type editors for charts, KPI groups, maps, dashboards, and data sources. `:id?` optional means the same page handles both "create new" and "edit existing". |
| **Account & org settings** (behind `ProtectedRoute`) | `/private/edit/apikeys`, `/private/edit/orgs`, `/private/edit/settings` | Manage API keys (create/revoke/reinstate, view usage logs — see `packages/server`/`packages/client` READMEs for what a `dv_` key and its `READONLY`/`READWRITE` role actually gate), organizations and their members, and account settings. |
| **Admin** (behind `AdminRoute`) | `/private/god-mode-on` | "God Mode" — instance-wide user management console, gated on the session's `ADMIN` role. See **Admin ("God Mode")** below. |
| **Tools** | `/load-data`, `/generate-data`, `/generate-poi`, `/geo` | Standalone utilities: load data from a CSV/URL, generate sample datasets, generate point-of-interest data for cluster maps, and a GeoJSON/map utility page — useful for trying the platform without a saved project. |
| **Display / embed** ⚠️ restricted on our hosted instance | `/display/charts/:id`, `/display/dashboards/:id`, `/embed/charts/:id`, `/embed/dashboards/:id` | Public-facing render pages: `display/*` is a full standalone page for a published chart/dashboard; `embed/*` is the `<iframe>`-friendly variant (theme via `?theme=` query param or `postMessage`, see `packages/components/README.md`'s theming section). Gated by `PublishGate`/`EmbedGate` on the `VITE_ENABLE_PUBLIC_PUBLISHING` flag — see **Public publishing toggle** below. Public by default for self-hosted deployments; restricted on our own hosted instance (see the note at the top of this README) — use the components library or `packages/client` with an API key instead. |

### Admin ("God Mode")

`GodModeOnPage` (`src/pages/private/GodModeOn.tsx`), mounted at `/private/god-mode-on` behind `AdminRoute` — this wraps `ProtectedRoute`'s "must be logged in" check with an extra one: `user.role !== "ADMIN"` bounces to the home page (`src/components/auth/AdminRoute.tsx`). This is the platform's `Role` (global, on the `User` model), not a project/org role — see the root `README.md`'s roles table. There's no in-app link to it in the main nav; you have to navigate to the URL directly.

It's a single-page instance-wide user directory, backed by `routes/admin.ts` on the server (`GET/DELETE /admin/users/*`, all requiring `requireAdmin`):

- **Table of every user on the instance** (`react-data-table-component`, sortable/paginated), showing per row: email + user id, global `Role` badge, verification status (`Verified`/`Unverified`), every project the user can reach (owned — crowned badge — direct member, or via an org membership) and every org they belong to, and account creation date.
- **Per-user actions**, each behind a confirmation dialog (`GenericDialog`):
  - **Activate** — force-verifies the account without the user clicking an email link (only shown for unverified users).
  - **Resend activation email** — re-sends the activation PIN/link (only shown for unverified users).
  - **Reset password** — triggers a password-reset email for that user, available regardless of verification status.
  - **Delete** — permanently deletes the user and, per the confirmation warning, all their charts, dashboards, and data; irreversible, and the server rejects deleting your own account (`400 Cannot delete your own account.`) so an admin can't lock themselves out.
- Toast notifications on success/failure for every action; the user list is refetched/patched in place after activate/delete so the table stays consistent without a full reload.

This is deliberately a blunt instrument for instance operators (e.g. the Dipartimento team running the hosted deployment), not a project-level admin tool — it has no concept of projects/orgs beyond displaying them for context, and every action is global (works on any user regardless of which projects they're in). For project- or org-scoped member management (adding/removing members, changing `ProjectRole`/`OrgRole`), see `/private/edit/orgs` and the root README's [Progetti, Organizzazioni e Ownership](../../README.md#progetti-organizzazioni-e-ownership) section instead.

## Public publishing toggle

Whether this instance allows public chart/dashboard sharing at all is controlled by a single runtime flag, `VITE_ENABLE_PUBLIC_PUBLISHING` (`sample.env`, read via `isPublishingEnabled()` in `src/lib/api.ts` — same runtime-config-with-fallback pattern as `VITE_SERVER_URL`: `window.__ENV__` from `/config.json` first, then `import.meta.env` at build time). It defaults to enabled (anything other than the literal string `"false"` counts as enabled) so self-hosted deployments that never set it keep today's behavior. Toggling it changes three things at once:

1. **The "publish" toggle is hidden in every editor**, not just disabled — `EditChart`, `EditMap`, `EditKpiGroup`, `EditDashboard`, and `EditDataSource` all wrap their visibility `<input type="checkbox">` in an `isPublishingEnabled()` check. The underlying value also defaults to and is force-saved as `false` (in each page's save handler, and in `dashboard-edit.store.ts`/`kpi_store.ts` for the store-backed editors) — so even a chart that was `publish: true` before the flag was flipped off gets written back as `false` the next time it's saved, and there's no UI path to set it back to `true` while the flag is off.
2. **`/embed/*` is disabled outright.** `EmbedGate` (`src/components/embed/EmbedGate.tsx`), wrapping both embed routes in `router.tsx`, renders a plain "public embedding is disabled" message instead of the page when the flag is off. Embedding is inherently a no-login `<iframe>` use case, so unlike `/display/*` it can't be turned into an authenticated preview — it's just turned off.
3. **`/display/*` becomes an authenticated-only preview instead of a public page.** `PublishGate` (`src/components/auth/PublishGate.tsx`), wrapping both display routes, passes through unauthenticated when the flag is on (unchanged behavior); when it's off, it applies the same auth-gate as `ProtectedRoute` (redirect anonymous visitors to `/login`) and shows an inline "you're viewing an authenticated preview" banner. The pages themselves also switch their data source: `ShowChartPage` calls the authenticated `api.getChart` instead of the public `api.showChart`, and `useDashboardViewStore.load()` calls `findDashboardById` instead of `showDashboard` — both go through the same project-membership authorization as the editor, rather than the publish-gated public endpoint (which would always 401 once nothing can be `publish: true`).

Deploying this: locally, set `VITE_ENABLE_PUBLIC_PUBLISHING="false"` in `.env`; on Kubernetes, set `webapp.config.enablePublicPublishing: "false"` in the Helm chart's `values.yaml` (rendered into the `webapp-configmap.yaml` ConfigMap consumed by `main.tsx` at startup — no rebuild needed).

## Stack

| Layer | Choice |
|---|---|
| Build tool | Vite |
| Framework | React 19 + React Router v7 (routes centralized in `router.tsx`) |
| Styling | TailwindCSS v4 + DaisyUI v5 |
| State | Zustand (`src/lib/store/` — one store per domain: chart list, dashboard edit/view, data source list/edit, project, user, settings, KPI) |
| Complex flows | XState (`src/lib/stepMachine.ts`) — drives the multi-step chart-creation wizard |
| Data fetching | axios (`src/lib/api.ts`, injects `x-project-id` from `localStorage` on every request) + SWR for component-level fetching/caching |
| Forms | React Hook Form + Zod resolvers |
| Charts/rendering | `graph-italia-components` (workspace dependency) — this app is the primary consumer of that library |
| Dashboard layout | `react-grid-layout` (drag-and-drop), `@hello-pangea/dnd` (other drag-and-drop UI, e.g. reordering) |
| i18n | i18next + `react-i18next`, Italian as default (`src/i18n/locales/{it,en}`) |
| Testing | Vitest + `@testing-library/react` + `happy-dom`; accessibility tests via `vitest-axe` (`src/tests/a11y/`, WCAG checks at component/page level) |

## Running it

```bash
bun install
cp sample.env .env   # sets VITE_SERVER_URL and VITE_ENABLE_PUBLIC_PUBLISHING
bun run dev          # vite --port 3000, http://localhost:3000
```

Requires `packages/server` running (or a deployed instance) at `VITE_SERVER_URL`, and `packages/components` built at least once (`bun run build:components` from the repo root) since this app imports it as a workspace dependency.

```bash
bun run build      # tsc -b && vite build
bun run preview    # preview the production build
bun run test       # vitest run
bun run test:watch
bun run test:ui
```

In production/Kubernetes, runtime config (`VITE_SERVER_URL`, `VITE_ENABLE_PUBLIC_PUBLISHING`, and friends) is instead loaded from `/config.json` at startup (`main.tsx`, backed by a Kubernetes ConfigMap, see `charts/graph-italia/templates/webapp-configmap.yaml`) so the same built image can run against different environments without a rebuild — see `CLAUDE.md`'s "Runtime config" note. Locally, `.env` (via `import.meta.env`) is the fallback.

## How to contribute

1. **Branch/deploy flow**: feature branches off `main`, merged into `develop` first (auto-deploys to the `graph-italia-test` environment). Once verified, merge to `main`; production only deploys from a semantic tag (`v*.*.*`) — see `packages/server/README.md`'s "Taking part in development" section for the full GitFlow, which applies repo-wide.
2. **Adding a route**: add the page under `src/pages/<area>/`, register its path in the `ROUTES` object and the `routes` array in `router.tsx`, and add it to `MENU` if it should appear in navigation. Wrap it in `ProtectedRoute` (session required) or `AdminRoute` (admin role required) if it's private.
3. **Adding/using state**: prefer an existing Zustand store under `src/lib/store/` over introducing a new one; use XState (`stepMachine.ts`) only for genuinely multi-step flows, not simple form state.
4. **i18n**: add new UI strings to both `src/i18n/locales/it/` and `src/i18n/locales/en/` — Italian is the default locale and should never be missing a key that English has.
5. **Accessibility**: this app is built for public-sector sites, so WCAG compliance is a hard requirement, not a nice-to-have. If you touch a page or shared component, check whether an a11y test in `src/tests/a11y/` covers it (12 test files today, e.g. `form-labels`, `page-headings`, `interactive-labels`, `status-messages`) and add/extend one via `vitest-axe` if not.
6. **Testing**: `bun run test` before opening a PR. Component/page tests use Vitest + Testing Library + `happy-dom` (no real browser); don't skip the a11y suite when your change touches markup.
7. **Consuming `graph-italia-components` changes**: this app always builds against `packages/components/dist` (workspace dependency), so rebuild that package (`bun run build:components` from root, or `bun run dev` inside `packages/components` for watch mode) before your webapp change will reflect a components-side edit.

## Reusing this project

Graph Italia is designed to be forked/self-hosted, not just read: the monorepo separates concerns so you can take only what you need.

- **Just the rendering library**: install `graph-italia-components` from npm (see its README) and render your own chart/dashboard JSON — no server or this webapp required.
- **Full stack, your data**: run `packages/server` (Hono + Prisma/PostgreSQL) against your own database and point this webapp's `VITE_SERVER_URL` at it — see the root `CLAUDE.md` for the full environment variable reference, and `charts/graph-italia/` for a Helm chart if you're deploying to Kubernetes.
- **Custom frontend, existing server**: use `packages/client` (the generated typed API SDK) or plain REST calls against `packages/server`'s OpenAPI-documented API (`/docs`), and build your own UI instead of this webapp — this is exactly the separation that makes `packages/client` and `packages/components` independently useful.

Because it's a fork of a public-sector project, expect Italian-government-specific defaults (locale, legal pages, DaisyUI/Bootstrap-Italia-adjacent styling) that you'll likely want to reconfigure or remove for a general-purpose deployment.

## License & open source

Copyright © 2023-present Presidenza del Consiglio dei Ministri.

Released under the GNU Affero General Public License v3.0 only (SPDX: `AGPL-3.0-only`) — this is the license declared in `package.json` and consistent with every other package in this monorepo and with the project-level [`publiccode.yml`](../../publiccode.yml). (An earlier version of this README referenced BSD-3-Clause; that was a stale copy-paste, not a real license change — `AGPL-3.0-only` is authoritative.)

Graph Italia is maintained by Italy's Dipartimento per la Trasformazione Digitale as part of the [italia](https://github.com/italia) open-source organization on GitHub, under the [Developers Italia](https://developers.italia.it/) initiative for public-sector open source software. Being AGPL-3.0 licensed, if you run a modified version of this webapp as a network service, you're required to make your modified source available to its users — plan your fork accordingly if that matters for your deployment.
