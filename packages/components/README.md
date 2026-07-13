# graph-italia-components

`graph-italia-components` is a standalone React component library for rendering Graph Italia charts, dashboards, KPI tiles, and data tables — the same rendering engine used by the Graph Italia webapp, extracted so it can be embedded in any React app. It ships as ESM + CJS (Rollup build) with bundled TypeScript declarations.

It does **not** talk to the Graph Italia server by itself for its "dumb" components (`RenderChart`, `ChartWrapper`, `DataTable`, `KpiItem`, `RenderDashboard`) — you pass them chart/dashboard JSON directly. The `*Provider` components (`ChartProvider`, `DashboardProvider`, `DashboardGridProvider`) *do* fetch from the server given an API key + endpoint, if you'd rather not wire up the fetch yourself.

## Install

```bash
npm i graph-italia-components@latest
# or yarn add / pnpm add / bun add graph-italia-components@latest
```

This only pulls in the library itself. See **Peer dependencies** below — you must install those yourself, and their versions must satisfy the ranges in `package.json`.

## Peer dependencies

The library does not bundle React, ECharts, OpenLayers, etc. — they're declared as `peerDependencies` so your app controls the exact versions (and doesn't end up with duplicates). Install all of them:

```bash
npm i react@^19.1.0 react-dom@^19.1.0 \
  echarts@^5.6.0 echarts-for-react@^3.0.2 \
  ol@^10.5.0 \
  react-data-table-component@^7.7.0 \
  react-grid-layout@^2.2.2 \
  react-markdown@^10.1.0 remark-gfm@^4.0.1 \
  react-error-boundary@^6.0.0 \
  dayjs@^1.11.13
```

What each one is for:

| Dependency | Used by |
|---|---|
| `react`, `react-dom` | Everything (React 19). |
| `echarts`, `echarts-for-react` | `BasicChart` (bar/line), `PieChart`, `GeoMapChart`, `KpiGroup` — anything ECharts-rendered. |
| `ol` (OpenLayers) | `ClusterMap` (`chart: "cmap"`) — imports `ol/ol.css` internally, so you don't need to import OpenLayers' CSS yourself. |
| `react-data-table-component` | `DataTable` (the "Tabella dati" tab in `ChartWrapper`, and the standalone `DataTable` export). |
| `react-grid-layout` | `RenderDashboard` / `RenderGridDashboard` — the responsive dashboard grid. |
| `react-markdown`, `remark-gfm` | Markdown rendering inside `ChartWrapper`'s info panel, source text, and footer text. |
| `react-error-boundary` | Wraps `GeoMapChart` so a bad geoJSON/config doesn't crash the whole page. |
| `dayjs` | Date parsing/formatting utilities used across the table/wrapper components. |

If you only use a subset of components (e.g. only bar/line/pie charts, no maps or dashboards), you can skip installing `ol` and `react-grid-layout` — but TypeScript/bundlers may still warn about the unmet peer dep. Prefer installing everything to avoid surprises.

## Styles

The library ships **one bundled CSS file** (all component `.css` imports get concatenated by `rollup-plugin-import-css` at build time) — `chartWrapper.css`, `dataTable.css`, `kpi.css`, `map.css`, `poweredBy.css`. You must import it once, globally, in your app's entry point:

```ts
import "graph-italia-components/dist/style.css";
```

Without this import, components will render with no layout/spacing and dark-mode classes will have no effect.

### Theme classes vs. CSS custom properties

Most components read the current color scheme via `useResolvedTheme()`/`useColorScheme()` (see **Context** below) and apply a `graph-italia-light` / `graph-italia-dark` class alongside their own class names (e.g. `ChartWrapper` renders `<div className={`${resolvedTheme} cw-container`}>`). ECharts itself is themed separately by registering two built-in ECharts themes named `graph-italia-light` and `graph-italia-dark` (`src/themes/`), applied automatically to every chart via `RenderChart`.

### `spritePath` (download/share icons)

`ChartWrapper` renders its download/share buttons as `<svg><use href="{spritePath}#it-download" /></svg>`, defaulting to `/sprites.svg`. This follows the [Bootstrap Italia / Italia design system](https://italia.github.io/bootstrap-italia/) icon-sprite convention. If your app doesn't already serve a `sprites.svg` with `it-download`/`it-share` symbol IDs at that path, either:

- copy Bootstrap Italia's `svg/sprites.svg` into your public assets, or
- pass a custom `spritePath` prop pointing at your own sprite sheet with matching symbol IDs.

## Context

### `ColorSchemeProvider`

Controls the color scheme (`"light"` | `"dark"`) and the resolved ECharts theme for every component below it in the tree. Required if you want dark-mode support or theme switching; components fall back to `"light"` if no provider is present (default context value).

Resolution priority, highest first:
1. A custom ECharts theme object received via `postMessage`
2. `"light"` / `"dark"` received via `postMessage`
3. The `scheme` prop passed explicitly
4. Auto-detected from the `prefers-color-scheme` media query

```tsx
import { ColorSchemeProvider, RenderChart } from "graph-italia-components";

// Auto-detect from system preference
<ColorSchemeProvider>
  <RenderChart {...chartData} />
</ColorSchemeProvider>

// Force a specific scheme (e.g. driven by your app's own theme toggle)
<ColorSchemeProvider scheme={isDark ? "dark" : "light"}>
  <RenderChart {...chartData} />
</ColorSchemeProvider>
```

Consumed via two hooks, both exported from the package:

| Hook | Returns |
|---|---|
| `useColorScheme()` | `"light" \| "dark"` — the resolved scheme name. |
| `useResolvedTheme()` | `string \| Record<string, unknown>` — either the built-in theme name (`"graph-italia-light"` / `"graph-italia-dark"`) or a full custom ECharts theme object if one was pushed via `postMessage`. |

**postMessage protocol** (for iframe-embedded charts — see the webapp's `pages/embed/`): send `{ type: "GRAPH_ITALIA_THEME", theme: "dark" | "light" | <echartsThemeObject> }` to the iframe's `contentWindow`. A custom theme object follows the [ECharts theme format](https://echarts.apache.org/en/theme-builder.html); send `"light"`/`"dark"` again to revert to a built-in theme.

```js
iframe.contentWindow.postMessage({ type: "GRAPH_ITALIA_THEME", theme: "dark" }, "*");
```

Theme can also be set once via a `?theme=dark|light` query param when the *page itself* is the embed target (see the webapp's embed routes) — that's a webapp routing concern, not something this library reads directly.

### `ChartProvider` / `DashboardProvider` / `DashboardGridProvider` — not context, but similar shape

These aren't React context providers (no `useContext` consumer) — they're data-fetching wrapper components with a shared prop shape (`apiKey`, `endpoint`, `chartId`/`dashboardId`, `routePrefix`, loading/error slots). See **Usage: fetching from the server** below.

## Exported components, hooks & types

From `graph-italia-components` (see `src/index.ts`):

| Export | Kind | Description |
|---|---|---|
| `RenderChart` | Component | Renders a single chart from a `FieldDataType` — dispatches internally to bar/line, pie, geo map, cluster map, or KPI/KPI-group based on `chart`. No chrome (no title, tabs, download buttons). |
| `ChartWrapper` | Component | Wraps `RenderChart` with the full chart UI: title/subtitle, tabs (Grafico / Tabella dati / Info), CSV/PNG download buttons, share button, markdown footer/source text, "Powered by" badge. This is what the webapp editor and public chart pages use. |
| `RenderDashboard` | Component | Renders a full dashboard (`DashboardData` — an array of chart "slots" with grid positions) as a responsive `react-grid-layout` grid, each slot as bare `RenderChart` or full `ChartWrapper`. |
| `DataTable` | Component | Standalone data-grid view of a chart's tabular data (`react-data-table-component` under the hood) — sorting, column show/hide, reordering, CSV export. Used internally by `ChartWrapper`'s "Tabella dati" tab, also usable on its own. |
| `KpiItem` | Component | Renders one KPI tile (title, value, prefix/suffix, up/down flow indicator, footer text) from a `KpiItemType`. |
| `PoweredBy` | Component | The "Generato con Graph Italia" attribution badge shown under charts/dashboards; pass `label=""` to hide it, or a custom `label` string to replace it. |
| `ColorSchemeProvider` | Component | See **Context** above. |
| `ChartProvider` | Component | Fetches a single chart from the server by ID and renders it. See **Usage** below. |
| `DashboardProvider` | Component | Fetches a dashboard from the server by ID and renders it with `RenderDashboard` (free-form layout, matches slot `x`/`y`/`w`/`h`). |
| `DashboardGridProvider` | Component | Same as `DashboardProvider` but renders via `RenderGridDashboard` (a stricter auto-packed grid) — use whichever layout behavior matches your host app. |
| `useColorScheme` | Hook | Current resolved scheme, `"light" \| "dark"`. |
| `useResolvedTheme` | Hook | Current resolved ECharts theme (built-in name or custom object). |
| `ChartColorScheme` | Type | `"light" \| "dark"`. |
| `EchartsThemeValue` | Type | `string \| Record<string, unknown>`. |
| `ChartProviderProps`, `DashboardProviderProps`, `DashboardGridProviderProps` | Type | Full prop types for the three fetch-and-render providers. |
| `DashboardData`, `DashboardSlot`, `RenderDashboardProps` | Type | Dashboard shape: `{ id?, name?, description?, publish?, slots: DashboardSlot[] }`, where each slot has `{ settings: { i, x, y, w, h }, chart: FieldDataType }`. |
| `FieldDataType`, `ChartConfigType`, `MatrixType`, `KpiItemType`, `InfosType`, `PointData`, ... | Type | Chart/table/KPI data shapes — re-exported from `src/types.ts` via `export *`. `FieldDataType` is the core "one chart" shape (`{ chart, config, data, dataSource, name?, description?, ... }`) accepted by `RenderChart`/`ChartWrapper`/the providers. |

`RenderGridDashboard` itself (the component `DashboardGridProvider` renders internally) is **not** exported at the top level — only reachable through `DashboardGridProvider`.

## Types of usage

There are three ways to use this library, in increasing order of "batteries included":

### 1. Bring your own data — `RenderChart` / `ChartWrapper` / `DataTable` / `KpiItem`

You already have chart JSON (e.g. fetched yourself, or hardcoded) and just want it rendered. This is the lowest-level, most flexible option — you control fetching, caching, auth, everything.

```tsx
import { RenderChart, type FieldDataType } from "graph-italia-components";
import "graph-italia-components/dist/style.css";

const chart: FieldDataType = {
  id: "example-bar",
  chart: "bar",
  name: "Progetti per misura",
  description: "",
  dataSource: "",
  data: [
    ["Misura", "Liquidate", "Stanziate"],
    ["1.1 Infrastrutture digitali", 21070551, 148499540],
    ["1.2 Cloud", 187481680, 671303602],
  ],
  config: {
    colors: ["#003366", "#0066CC"],
    direction: "vertical",
    h: 350,
    legend: true,
    legendPosition: "top",
    labeLine: false,
    palette: [],
    tooltip: true,
    tooltipTrigger: "axis",
    tooltipFormatter: "number",
    valueFormatter: "",
    totalLabel: "Totale",
  },
  publish: true,
  remoteUrl: "",
  isRemote: false,
};

<RenderChart {...chart} />
```

With the full chart UI (title, tabs, download/share, "Powered by"):

```tsx
import { ChartWrapper, type FieldDataType } from "graph-italia-components";

<ChartWrapper
  id={chart.id}
  data={chart}
  info={{
    text: "Descrizione estesa del grafico, mostrata nel tab Info.",
    title: "Progetti per misura",
    subTitle: "Avanzamento al 2025",
    labelSource: "Fonte Dati",
    sourceTextInfo: "*OpenCoesione*",
    chartFooterText: "Nota a piè di grafico in **markdown**.",
  }}
  enableDownloadData
  enableDownloadImage
  shareFunction={(id) => navigator.clipboard.writeText(`${location.href}#${id}`)}
  showPoweredBy
/>
```

Standalone table and KPI tile:

```tsx
import { DataTable, KpiItem, type MatrixType, type KpiItemType } from "graph-italia-components";

const rows: MatrixType = [
  ["Regione", "Popolazione"],
  ["Lazio", 5_720_000],
  ["Lombardia", 10_060_000],
];
<DataTable data={rows} enableExportCsv />

const kpi: KpiItemType = {
  title: "Risorse allocate",
  value: "2778",
  value_prefix: "€",
  value_suffix: "milioni",
  show_flow: true,
  flow_value: "12%",
  flow_direction: "+",
};
<KpiItem data={kpi} />
```

### 2. A full dashboard you already fetched — `RenderDashboard`

```tsx
import { RenderDashboard, type DashboardData } from "graph-italia-components";

const dashboard: DashboardData = {
  name: "Monitoraggio PNRR",
  description: "Vista sintetica per missione",
  slots: [
    { settings: { i: "slot-1", x: 0, y: 0, w: 2, h: 1 }, chart: chart1 },
    { settings: { i: "slot-2", x: 2, y: 0, w: 1, h: 1 }, chart: chart2 },
  ],
};

<RenderDashboard data={dashboard} withWrapper showPoweredBy />
```

### 3. Fetch-and-render against a Graph Italia server — `ChartProvider` / `DashboardProvider` / `DashboardGridProvider`

For embedding a chart/dashboard by ID with an API key, no manual `fetch` needed — these components own the request lifecycle (loading/error states, abort-on-unmount) and hand off to the components above once the data arrives.

```tsx
import { ChartProvider } from "graph-italia-components";
import "graph-italia-components/dist/style.css";

<ChartProvider
  apiKey="dv_your_project_key"       // an API key created in project settings (see packages/client README)
  endpoint="https://your-server-api.com"
  chartId="unique-chart-id-123"
  withWrapper
  detectUserPrefColorsSchema         // auto light/dark from the embedding page
  showPoweredBy
/>
```

```tsx
import { DashboardGridProvider } from "graph-italia-components";

<DashboardGridProvider
  apiKey="dv_your_project_key"
  endpoint="https://your-server-api.com"
  dashboardId="unique-dashboard-id-123"
  detectUserPrefColorsSchema
  wrapperFuncts={{ enableDownloadData: true, enableDownloadImage: true }}
/>
```

Both `ChartProvider`/`DashboardProvider`/`DashboardGridProvider` accept `loadingElement`/`errorElement` overrides for custom loading/error UI, and internally wrap their content in `ColorSchemeProvider` when `detectUserPrefColorsSchema` is set — you don't need to add your own provider in that case. If you're driving the scheme yourself (e.g. from your host app's own theme state), wrap them in your own `<ColorSchemeProvider scheme={...}>` instead and leave `detectUserPrefColorsSchema` off.

The API key must be `dv_`-prefixed and is sent as `Authorization: Bearer <apiKey>` to `{endpoint}{routePrefix}/charts/{chartId}` or `/dashboards/{dashboardId}` (`routePrefix` defaults to `/api`). See the `packages/client` README for how API keys, roles, and scopes work on the server side.

## How to dev / maintain this package

```bash
cd packages/components
bun run dev     # rollup -c -w, rebuilds dist/ on change
bun run build    # one-off build (also runs automatically via prepublishOnly before npm publish)
```

Adding a new runtime dependency: decide if it belongs in `dependencies` (bundled) or `peerDependencies` + `devDependencies` (left to the consumer — the pattern this package uses for everything React/ECharts/OpenLayers-related, so consumers don't get duplicate copies):

```bash
npm i --save-peer some-lib
npm i --save-dev some-lib   # so it's available while building/type-checking this package itself
```

Releasing: bump `version` in `package.json`, then either push a `v*.*.*` tag (CI's `publish-npm` job in `.github/workflows/release.yml` builds and publishes automatically, skipping if that version is already on npm) or publish manually:

```bash
bun run build
npm publish --access public
```

Then bump the version in consumers, e.g. the example app:

```bash
cd packages/ui-example-app
npm add graph-italia-components@latest
```

`packages/ui-example-app` (a minimal Vite app, `bun run dev:components`-adjacent — see root `bun run dev` scripts) exercises every exported component with realistic sample data; check it for more usage patterns than fit in this README, and use it to visually verify changes before publishing.
