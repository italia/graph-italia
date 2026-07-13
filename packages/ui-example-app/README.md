# Graph-Italia Ui Example App

A minimal Vite + React app whose only job is to **exercise every component exported by `graph-italia-components`** with realistic sample data. It's not a product — it's the living reference/demo for that library: consult it when you need a working code example beyond what fits in [`packages/components/README.md`](../components/README.md), and use it to visually check for regressions before publishing a new version of the components package.

It consumes `graph-italia-components` as a normal npm dependency (`"graph-italia-components": "workspace:*"` in `package.json`), so it always builds against whatever is currently in `packages/components/dist` — this is the fastest way to see the effect of a components-package change without setting up a separate consumer project.

## Spinning up the app

From the repo root:

```bash
bun install
bun run --filter graph-italia-components build   # dist/ must exist — see below
bun run dev:components                            # optional: rollup -c -w, rebuilds on change
```

Then, from `packages/ui-example-app`:

```bash
cd packages/ui-example-app
bun run dev        # vite --port 3002
```

Or directly from the root with the workspace filter: `bun run --filter graph-italia-uiexampleapp dev`.

Because this app imports from `graph-italia-components`'s built output (`dist/index.js`, `dist/style.css`), **the components package must be built at least once** before the example app will pick up any changes (`bun run build` in `packages/components`, or run `bun run dev` there in watch mode alongside this app's dev server).

Other scripts (run from `packages/ui-example-app`):

```bash
bun run build      # tsc -b && vite build -> dist/
bun run preview    # preview the production build locally
bun run lint       # eslint .
```

### Environment variables

Only needed for the three server-backed examples (`ChartProvider`/`DashboardProvider`/`DashboardGridProvider` — see below). Copy/create a `.env` in `packages/ui-example-app` (gitignored) with:

```
VITE_ENDPOINT=http://localhost:3003
VITE_API_KEY=dv_your_project_key
VITE_CHART_ID=your-chart-id
VITE_DASHBOARD_ID=your-dashboard-id
```

`VITE_ENDPOINT` should point at a running `packages/server` instance (or a deployed one); `VITE_API_KEY` is a `dv_`-prefixed API key scoped to a project on that server (see `packages/client/README.md` for how API keys and their `READONLY`/`READWRITE` scopes work); `VITE_CHART_ID`/`VITE_DASHBOARD_ID` must be IDs of a chart/dashboard that key's project can read. Without a `.env`, the provider examples fall back to placeholder values (`dv_your_project_key`, `http://localhost:3003`, `your-chart-id`) and will simply show the error state — every other example works with zero configuration.

### Deployment

Pushes to `main` build this app (after building `graph-italia-components` first) and publish it to GitHub Pages via `.github/workflows/deploy-ui-example-pages.yml`. `vite.config.ts` auto-detects the GitHub Pages base path from `GITHUB_REPOSITORY` when `GITHUB_ACTIONS` is set, so no manual `base` config is needed locally.

## Examples reported (`src/App.tsx`)

All examples are mounted in a single page (`App.tsx`), each wrapped by a top-level `ColorSchemeProvider` driven by a light/dark toggle button — use that toggle to check theming on every example at once.

| File                                                                                               | Demonstrates                                                                                                                                                                                                            |
| -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SampleWrapper.tsx`                                                                                | `ChartWrapper` around a bar chart — full chart chrome: title/subtitle, tabs (Grafico / Tabella dati / Info), download data/image buttons, share button, markdown footer & source text.                                  |
| `SampleWrapperBar.tsx`, `SampleWrapperLine.tsx`, `SampleWrapperPie.tsx`, `SampleWrapperGeomap.tsx` | Same `ChartWrapper` pattern, one per chart type (`bar`, `line`, `pie`, `map`).                                                                                                                                          |
| `SampleTable.tsx`                                                                                  | `DataTable` standalone, five variants: default, with column filters (`showFilters`), with drag-and-drop column reorder (`enableColumnReorder`), with CSV export (`enableExportCsv`), and all features combined.         |
| `SampleGeomapchart.tsx`                                                                            | Bare `RenderChart` with `chart: "map"` — a GeoJSON-based choropleth map.                                                                                                                                                |
| `SampleBarchart.tsx`                                                                               | Bare `RenderChart` with `chart: "bar"` — no wrapper chrome, just the chart.                                                                                                                                             |
| `SampleLinechart.tsx`                                                                              | Bare `RenderChart` with `chart: "line"`.                                                                                                                                                                                |
| `SamplePiechart.tsx`                                                                               | Bare `RenderChart` with `chart: "pie"`.                                                                                                                                                                                 |
| `SampleKpis.tsx`                                                                                   | `RenderChart` with `chart: "kpi"` in both `horizontal`/`vertical` directions and multiple KPIs via `dataSource`, plus two standalone `KpiItem` tiles side by side (`generateFakeKpis` from `lib/utils.ts`).             |
| `SampleMap.tsx`                                                                                    | Bare `RenderChart` with `chart: "cmap"` (`ClusterMap`) — 100 randomly generated points (`lib/generatePoints.ts`) clustered on an OpenLayers/OSM map.                                                                    |
| `SampleChartProvider.tsx`                                                                          | `ChartProvider` — fetches a single chart from a live server by ID/API key and renders it with `withWrapper`. Currently commented out in `App.tsx`; enable it once you have `.env` values set.                           |
| `SampleDashboardProvider.tsx`                                                                      | `DashboardProvider` — fetches a dashboard by ID and renders it via `RenderDashboard`'s free-form slot layout. Also commented out in `App.tsx` by default.                                                               |
| `SampleDashboardGridProvider.tsx`                                                                  | `DashboardGridProvider` — same fetch, rendered via the auto-packed `RenderGridDashboard` grid instead; shown with `withWrapper`, custom `wrapperLabels`, and `showDataTransposed`. This one **is** active in `App.tsx`. |

Supporting files: `lib/generatePoints.ts` (random `PointData[]` generator for the cluster map), `lib/getMarkerIcon.ts` (marker icon helper for `ClusterMap`), `lib/utils.ts` (`generateFakeKpis` — random `KpiItemType[]` generator for the KPI examples).

## Mini guide — client vs. providers

This app shows both ways of getting data into `graph-italia-components`; which one to reach for depends on where your data comes from.

### 1. `packages/client` (the typed API client) — you own the fetch

Use `graph-italia-cli` (`packages/client`, see its README) when you need more control than "fetch one chart/dashboard by ID and render it" — e.g. listing charts, building your own loading/caching layer, calling non-chart endpoints (dashboards CRUD, datasources, orgs/projects, API key management), or working outside React entirely. It's a thin typed wrapper over `axios`; you call the function, you get the JSON, you decide what to do with it (typically: pass the `chart`/`dashboard` shape straight into `RenderChart`/`ChartWrapper`/`RenderDashboard` from `graph-italia-components`).

```ts
import axios from "axios";
import { getGraphItaliaAPI } from "graph-italia-cli";
import { RenderChart } from "graph-italia-components";

const client = getGraphItaliaAPI(
  axios.create({ baseURL: ENDPOINT, headers: { Authorization: `Bearer ${API_KEY}` } })
);

const { data: chart } = await client.getApiChartsById(chartId);
<RenderChart {...chart} />
```

None of the examples in this app currently import `graph-italia-cli` directly — they either hardcode sample data or use the `*Provider` components below, which do their own internal `fetch` rather than going through the typed client. Reach for the client when a `*Provider` component's fixed prop set (chart/dashboard by ID, nothing else) isn't enough.

### 2. `ChartProvider` / `DashboardProvider` / `DashboardGridProvider` (from `graph-italia-components`) — batteries included

Use these (`SampleChartProvider.tsx`, `SampleDashboardProvider.tsx`, `SampleDashboardGridProvider.tsx` in this app) when you just want to embed one specific published chart or dashboard by ID and don't need anything else from the API. They own the `fetch` call, loading state, error state, and abort-on-unmount — you only supply `apiKey`, `endpoint`, and `chartId`/`dashboardId`:

```tsx
<ChartProvider
  apiKey={API_KEY}
  endpoint={ENDPOINT}
  chartId={CHART_ID}
  withWrapper
/>
```

`DashboardProvider` vs. `DashboardGridProvider` differ only in layout engine: `DashboardProvider` renders slots at their exact saved `x`/`y`/`w`/`h` positions (`RenderDashboard`), while `DashboardGridProvider` re-packs them into a stricter responsive grid (`RenderGridDashboard`) — pick whichever matches how you want the dashboard to reflow on narrow screens.

**Rule of thumb:** reach for a `*Provider` first (as this app's examples do) — it's less code. Drop down to `packages/client` once you need to do anything beyond "render this one chart/dashboard by ID" (listing, searching, mutating, or any non-chart resource).
