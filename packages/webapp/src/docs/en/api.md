# REST API

Everything you do from the interface can be done through the API: create and update charts, read dashboards, feed data sources from a script.

## API key

1. Go to **user menu → API Keys**;
2. create a key choosing the role: **READONLY** (read only) or **READWRITE** (read and write);
3. copy the value right away (it starts with `dv_`): it will not be shown again.

The key is **tied to the project** active at the time of creation: requests operate on that project.

## Authentication

Pass the key in the `Authorization` header:

```bash
curl -H "Authorization: Bearer dv_YOUR_KEY" \
  https://SERVER/api/charts
```

## Main endpoints

| Resource | Endpoint | Operations |
| --- | --- | --- |
| Charts | `/api/charts` | list, detail, create, update, delete |
| Public chart | `/api/charts/show/:id` | read without authentication (public items only) |
| KPI groups | `/api/charts/kpi-group` | create and update KPI groups |
| Dashboards | `/api/dashboards` | list, detail, slots |
| Data sources | `/api/datasources` | list, detail, create, update data |

## Interactive documentation

The server exposes the **OpenAPI** specification at `/openapi.json` and interactive documentation (Scalar) at `/docs`, with all the endpoints, the schemas and the option to try the calls.

## Example: updating a data source from a script

```bash
curl -X PUT \
  -H "Authorization: Bearer dv_YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"data": [["region","value"],["Lazio",42]]}' \
  https://SERVER/api/datasources/SOURCE_ID
```

With a READWRITE key and a nightly cron job, the project datasets always stay up to date.
