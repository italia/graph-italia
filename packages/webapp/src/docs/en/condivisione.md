# Sharing and integrating

## Sharing with your team

To work with other people on the same charts, use **organizations** (**user menu → Organizations**):

1. create an organization: you become its administrator (ADMIN role);
2. in the **Members** tab click **Add Member** and invite your colleagues by email, choosing their role: **ADMIN** can manage the organization's members and projects, **USER** works on the projects;
3. in the **Projects** tab click **Transfer Project** and pick one of your personal projects.

From then on every member finds the project in the Private Area selector and can see and edit its charts, maps, KPI groups, dashboards and datasets.

- You remain the **owner** of the project: transferring it to the organization means sharing it, not giving it away;
- you can **revoke** the association at any time, and the project goes back to being personal;
- API keys stay tied to the project, so whoever uses them sees the same items as the team.

Roles and permissions are explained in [Projects and organizations](/docs/organizzazioni).

<!-- publishing:off -->
## Publishing on this instance

Graph Italia can make charts and dashboards public. Whoever runs an instance turns this feature on or off with a server setting (`ENABLE_PUBLIC_PUBLISHING`): **on this instance publishing is turned off**.

In practice every item behaves as if it were always **private**:

- only the people who access the project can see it, that is you and, if the project is associated with an organization, its members;
- the editor has no visibility setting, and the lists show no public links or embed codes.

Graph Italia is open source software: whoever installs it on their own infrastructure can turn publishing on. The [project README](https://github.com/italia/graph-italia#pubblicazione-pubblica-link-e-embed) explains how.
<!-- /publishing -->

## Integrating charts and dashboards in your website

To show a chart or a dashboard in your website or web application:

1. create a read-only (READONLY) **API key** for the project that contains the item (**user menu → API Keys**, see [REST API](/docs/api));
2. install the React library `graph-italia-components` and use `ChartProvider` (one chart) or `DashboardGridProvider` (a dashboard), passing the key, the server address and the item identifier: the component fetches configuration and data and draws the chart;
3. if you do not use React, or want to integrate the data in your own backend, use the REST API or the typed client `graph-italia-cli`.

```jsx
import { ChartProvider } from "graph-italia-components";

<ChartProvider
  apiKey="dv_YOUR_KEY"
  endpoint="https://SERVER"
  chartId="CHART_ID"
  withWrapper
/>
```

- A key used in the browser is visible to whoever visits the page and lets them read **all** the items of the project: always use a READONLY key and keep in a dedicated project only what you want to show;
- to keep the key hidden, make the calls from your server and pass only the data to the browser;
- you can revoke a key at any time from the **API Keys** page.
<!-- publishing:on -->

## Data refresh

Public charts linked to a remote URL refresh by themselves on the first view after 24 hours since the last update: the server downloads the source again and reapplies the saved transformations.
<!-- /publishing -->
