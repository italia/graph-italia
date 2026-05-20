# Graph Italia Grafana Dashboards

This directory contains Grafana dashboard definitions used by the
Dipartimento Trasformazione Digitale to monitor applications deployed
in the same Kubernetes cluster as Graph Italia.

## Available Dashboards

### graph-italia-dashboard.json

Main monitoring dashboard for the **Graph Italia** application
(`charts/graph-italia`).

| Section | Metrics |
|---------|---------|
| **Overview** | Request Rate, Error Rate (5xx), API Latency (p99), Running Pods |
| **HTTP Traffic** | Request Rate by Status, Latency Percentiles (p50/p90/p99), Request Rate by Endpoint |
| **Database** | Query Latency by Operation, Queries by Operation/Status |
| **AI (OpenAI)** | AI Request Latency, AI Requests Count (success/error) |
| **Resources** | Memory Usage, CPU Usage |

### rag-padigitale2026-dashboard.json

Pipeline monitoring dashboard for **rag-padigitale2026**, a RAG
application that ingests CSV / ODT / HTML / MD documents, embeds them
through OpenAI `text-embedding-3-large`, and stores vectors in Qdrant.
Source code:
[teamdigitale/rag-padigitale2026](https://github.com/teamdigitale/rag-padigitale2026).

| Section | Description |
|---------|-------------|
| **KPI** | Qdrant uptime (gauge), Qdrant latency (gauge), indexed vectors (stat with `showPercentChange`), webapp 5xx rate |
| **Pipeline flow** | Graphviz DAG (`grafana-graphviz-panel`, Private Preview) — loader → splitter → OpenAI embed → batcher → Qdrant; webapp → Redis/Postgres/Qdrant. Node fill colour driven by health, edge thickness driven by Qdrant PUT/POST rate |
| **Pod readiness** | State timeline for `rag-padigitale2026-*` pods |
| **Ingestion runs** | Status history of batches (Loki), bar gauge LCD OK vs KO, average run duration, table of latest runs with inline gauge cell |
| **Qdrant deep-dive** | Top endpoints by RPS (bar gauge), vector growth per collection, latency per endpoint, response status timeseries |
| **Resources** | CPU per pod (threshold area), memory saturation (bar gauge) |
| **Logs** | Top error sources aggregated, ingestion log, webapp log |

#### Required plugin

- [`grafana-graphviz-panel`](https://github.com/grafana/grafana-graphviz-panel)
  ≥ `0.0.5` (Private Preview). Install via `GF_INSTALL_PLUGINS` or the
  `grafana.plugins` value of the upstream `grafana/grafana` chart.
  Requires Grafana ≥ 12.3.

## How to Use

### Option 1: Automatic Deployment via Helm (Recommended for Kubernetes)

If you're using the Grafana sidecar for dashboard provisioning:

```yaml
# values.yaml
monitoring:
  grafanaDashboard:
    enabled: true
    labels:
      grafana_dashboard: "1"  # Label for Grafana sidecar discovery
    namespace: "monitoring"   # Namespace where Grafana is deployed
```

The dashboard will be automatically created as a ConfigMap and discovered by Grafana.

### Option 2: Manual Import

1. Open Grafana UI
2. Go to **Dashboards** > **Import**
3. Click **Upload JSON file**
4. Select the dashboard JSON file you want to import
5. Configure the Prometheus (and Loki, where applicable) datasource
6. Click **Import**

### Option 3: Grafana Provisioning

Copy the dashboard to your Grafana provisioning directory:

```bash
cp graph-italia-dashboard.json /etc/grafana/provisioning/dashboards/
```

And configure the provisioning in `grafana.ini` or via ConfigMap:

```yaml
apiVersion: 1
providers:
  - name: 'default'
    folder: ''
    type: file
    options:
      path: /etc/grafana/provisioning/dashboards
```

## Required Metrics

### graph-italia-dashboard.json

#### HTTP Metrics (from server)
- `http_requests_total{namespace, method, path, status}` - Request counter
- `http_request_duration_seconds_bucket{namespace, method, path}` - Request latency histogram

#### Database Metrics
- `graph_italia_db_queries_total{namespace, operation, status}` - Query counter
- `graph_italia_db_query_duration_seconds_bucket{namespace, operation}` - Query latency histogram

#### AI/OpenAI Metrics
- `graph_italia_ai_requests_total{namespace, status}` - AI request counter
- `graph_italia_ai_request_duration_seconds_bucket{namespace, model}` - AI request latency histogram

#### Kubernetes Metrics (from kube-state-metrics)
- `kube_deployment_status_replicas_available{namespace, deployment}`
- `container_memory_working_set_bytes{namespace, container}`
- `container_cpu_usage_seconds_total{namespace, container}`

### rag-padigitale2026-dashboard.json

#### Qdrant Metrics
- `collection_points{namespace, id}` - vectors per collection
- `collections_total{namespace}` - total collections
- `rest_responses_total{namespace, method, endpoint, status_code}` - REST request counter
- `rest_responses_avg_duration_seconds{namespace, endpoint}` - average response time
- `up{namespace, job}` - Qdrant scrape target

#### Kubernetes Metrics (from kube-state-metrics)
- `kube_deployment_status_replicas_available{namespace, deployment}`
- `kube_pod_status_ready{namespace, pod, condition}`
- `kube_pod_container_resource_limits{namespace, pod, resource}`
- `container_memory_working_set_bytes{namespace, container}`
- `container_cpu_usage_seconds_total{namespace, container}`

#### NGINX Ingress (optional, for 5xx KPI)
- `nginx_ingress_controller_requests{exported_namespace, status}`

#### Loki (logs)
- `{namespace, app="rag-padigitale2026-worker"}` for ingestion logs
- `{namespace, app="rag-padigitale2026-webapp"}` for serving logs

## Variables

### graph-italia-dashboard.json

| Variable | Description | Default |
|----------|-------------|---------|
| `datasource` | Prometheus datasource | Auto-detected |
| `namespace` | Kubernetes namespace filter | `graph-italia.*` regex |

### rag-padigitale2026-dashboard.json

| Variable | Description | Default |
|----------|-------------|---------|
| `datasource` | Prometheus datasource | Auto-detected |
| `loki_datasource` | Loki datasource | Auto-detected |
| `env` | App namespace (Environment selector) | `🟢 prod : rag-padigitale2026` |
| `qdrant_ns` | Qdrant namespace selector | `🟢 prod : qdrant-prod` |
| `collection` | Qdrant collection filter | `All` |

Six hidden scalar variables (`vectors_total`, `collections_n`,
`qdrant_rps`, `qdrant_lat_ms`, `webapp_replicas`, `worker_replicas`)
feed the dynamic counters embedded in the Graphviz DOT diagram via
Prometheus `query_result()` plus regex extraction.

## Alert Rules

Alert rules for Graph Italia are defined separately in
`templates/prometheusrule.yaml`. See the main chart documentation for
alert configuration. The rag-padigitale2026 dashboard does not ship
PrometheusRule definitions in this repository — they live alongside
the application configuration.
