# Graph Italia Components

This is a react library.

## Install

You can install with

```
npm i graph-italia-components@latest
# or yarn
yarn add graph-italia-components@latest
# or pnpm
pnpm add graph-italia-components@latest
# or bun
bun add graph-italia-components@latest
```

## Usage

check the `exxample app`

## Theming

The library ships with two built-in ECharts themes: **light** (`graph-italia-light`) and **dark** (`graph-italia-dark`).
Theme switching is handled automatically through the `ColorSchemeProvider` component.

### ColorSchemeProvider

Wrap your chart components with `ColorSchemeProvider` to control the active theme.
The provider resolves the theme with this priority:

1. Custom theme object received via `postMessage`
2. `"light"` / `"dark"` received via `postMessage`
3. `scheme` prop passed explicitly
4. Auto-detect from `prefers-color-scheme` media query

```tsx
import { ColorSchemeProvider, RenderChart } from "graph-italia-components";

// Auto-detect from system preference
<ColorSchemeProvider>
  <RenderChart {...chartData} />
</ColorSchemeProvider>

// Force a specific scheme
<ColorSchemeProvider scheme="dark">
  <RenderChart {...chartData} />
</ColorSchemeProvider>
```

### Theme via query params (iframe embed)

When embedding charts in an iframe, pass the `theme` query parameter in the URL:

```
https://your-app.com/embed/chart/123?theme=dark
https://your-app.com/embed/chart/123?theme=light
```

If the parameter is omitted, the theme is auto-detected from the browser's `prefers-color-scheme`.

Example in the host page:

```html
<iframe src="https://your-app.com/embed/chart/123?theme=dark"></iframe>
```

### Theme via postMessage

For dynamic theme switching without reloading the iframe, use `postMessage`.
The protocol expects a message with `type: "GRAPH_ITALIA_THEME"` and a `theme` payload.

#### Light / Dark

Send `"light"` or `"dark"` as the `theme` value:

```js
const iframe = document.getElementById("chart-iframe");

// Switch to dark mode
iframe.contentWindow.postMessage(
  { type: "GRAPH_ITALIA_THEME", theme: "dark" },
  "*"
);

// Switch to light mode
iframe.contentWindow.postMessage(
  { type: "GRAPH_ITALIA_THEME", theme: "light" },
  "*"
);
```

#### Custom theme object

Send a full ECharts theme configuration object as the `theme` value.
This is applied directly to the chart instance, completely overriding the built-in themes:

```js
const iframe = document.getElementById("chart-iframe");

iframe.contentWindow.postMessage(
  {
    type: "GRAPH_ITALIA_THEME",
    theme: {
      color: ["#c12e34", "#e6b600", "#0098d9", "#2b821d", "#005eaa"],
      backgroundColor: "#0d0d1a",
      textStyle: { color: "#cccccc" },
      title: {
        textStyle: { color: "#ffffff", fontWeight: "600" },
      },
      tooltip: {
        backgroundColor: "rgba(30,30,60,0.95)",
        borderColor: "#555",
        textStyle: { color: "#eee" },
      },
    },
  },
  "*"
);
```

The custom theme object follows the [ECharts theme format](https://echarts.apache.org/en/theme-builder.html).
To revert to a built-in theme after sending a custom one, simply send `"light"` or `"dark"` again.

#### Listening in the parent for ready state

If you need to send the theme as soon as the iframe loads:

```js
const iframe = document.getElementById("chart-iframe");

iframe.addEventListener("load", () => {
  iframe.contentWindow.postMessage(
    { type: "GRAPH_ITALIA_THEME", theme: "dark" },
    "*"
  );
});
```

### Exported utilities

| Export                | Type       | Description                                        |
| --------------------- | ---------- | -------------------------------------------------- |
| `ColorSchemeProvider`  | Component  | React provider for theme context                   |
| `useColorScheme`       | Hook       | Returns the current scheme (`"light"` \| `"dark"`) |
| `useResolvedTheme`    | Hook       | Returns the resolved theme (string or object)      |
| `ChartColorScheme`     | Type       | `"light" \| "dark"`                                |
| `EchartsThemeValue`    | Type       | `string \| Record<string, unknown>`                |

## Deps

you have to add peerDeps to you projects.

# How To Dev

to add deps use `npm` please and add each required lib as dev and peer deps like:

```zsh
npm i --save-dev ol
npm i --save-peer ol
```

to update the build

```zsh
npm run build
```

than bump the version and push to npm

```zsh
npm publish
```

than install the last version inside example project

```zsh
npm add graph-italia-components@latest
```
