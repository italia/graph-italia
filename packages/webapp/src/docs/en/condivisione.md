# Publishing and sharing

<!-- publishing:off -->
## Integrating charts and dashboards in your website

On this instance **public publishing is turned off**: items have no public link (`/display/...`), cannot be embedded with an iframe (`/embed/...`) and the editor has no visibility setting. They stay reserved to you and to the people working on your projects.

To show a chart or a dashboard in your website or web application:

1. create a read-only (READONLY) **API key** for the project that holds the item (**user menu → API Key**, see [REST API](/docs/api));
2. install the React library `graph-italia-components` and use `ChartProvider` (one chart) or `DashboardGridProvider` (one dashboard), passing the key, the server address and the item identifier: the component fetches configuration and data and draws the chart;
3. if you do not use React, or want to bring the data into your own backend, use the REST API or the typed client `graph-italia-cli`.

```jsx
import { ChartProvider } from "graph-italia-components";

<ChartProvider
  apiKey="dv_YOUR_KEY"
  endpoint="https://SERVER"
  chartId="CHART_ID"
  withWrapper
/>
```

- A key used in the browser is visible to whoever visits the page and can read **every** item of the project: always use a READONLY key and keep in a dedicated project only what you want to show;
- to keep the key private, make the calls from your own server and send only the data to the browser;
- you can revoke a key at any time from the **API Key** page.
<!-- /publishing -->
<!-- publishing:on -->
## Item visibility

For every item you create, you can set the visibility in the **Setup Info** section of the editor. Items can be:

- **Public**: anyone with the link can see them and they can be embedded in other sites;
- **Private**: visible only in your Private Area; the public link shows a notice and the sharing buttons are not available.

## How to share a public link

In the **Share** column of the list you find the direct link to the display page: `/display/charts/...` for charts and `/display/dashboards/...` for dashboards.

## How to embed an item in another site (embed)

The button with the code icon generates an **iframe** ready to paste into your site:

```html
<iframe width="600" height="400" src="https://.../embed/charts/ID" frameborder="0" allowfullscreen></iframe>
```

- The embed is minimal: only the visualisation, with no header or footer;
- the theme follows the visitor's preferences (light/dark); you can force it with `?theme=light` or `?theme=dark` at the end of the URL;
- adjust `width` and `height` to the needs of your page.

## Integrating with the component library

As an alternative to the public link and the iframe, you can show private items too in your website with the React library `graph-italia-components` and a read-only project **API key** (see [REST API](/docs/api)).

## Data refresh

Public charts linked to a remote URL refresh on their own at the first view after 24 hours from the last update: the server downloads the source again and applies the saved transformations.
<!-- /publishing -->
