# DataViz Grafana Dashboards

This directory contains Grafana dashboard definitions for monitoring the DataViz application.

## Available Dashboards

### dataviz-dashboard.json

Main application monitoring dashboard with the following panels:

| Section | Metrics |
|---------|---------|
| **Overview** | Request Rate, Error Rate (5xx), API Latency (p99), Running Pods |
| **HTTP Traffic** | Request Rate by Status, Latency Percentiles (p50/p90/p99), Request Rate by Endpoint |
| **Database** | Query Latency by Operation, Queries by Operation/Status |
| **AI (OpenAI)** | AI Request Latency, AI Requests Count (success/error) |
| **Resources** | Memory Usage, CPU Usage |

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
4. Select `dataviz-dashboard.json`
5. Configure the Prometheus datasource
6. Click **Import**

### Option 3: Grafana Provisioning

Copy the dashboard to your Grafana provisioning directory:

```bash
cp dataviz-dashboard.json /etc/grafana/provisioning/dashboards/
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

The dashboard expects the following Prometheus metrics:

### HTTP Metrics (from server)
- `http_requests_total{namespace, method, path, status}` - Request counter
- `http_request_duration_seconds_bucket{namespace, method, path}` - Request latency histogram

### Database Metrics
- `dataviz_db_queries_total{namespace, operation, status}` - Query counter
- `dataviz_db_query_duration_seconds_bucket{namespace, operation}` - Query latency histogram

### AI/OpenAI Metrics
- `dataviz_ai_requests_total{namespace, status}` - AI request counter
- `dataviz_ai_request_duration_seconds_bucket{namespace, model}` - AI request latency histogram

### Kubernetes Metrics (from kube-state-metrics)
- `kube_deployment_status_replicas_available{namespace, deployment}`
- `container_memory_working_set_bytes{namespace, container}`
- `container_cpu_usage_seconds_total{namespace, container}`

## Variables

The dashboard includes these template variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `datasource` | Prometheus datasource | Auto-detected |
| `namespace` | Kubernetes namespace filter | `dataviz.*` regex |

## Alert Rules

Alert rules are defined separately in `templates/prometheusrule.yaml`. See the main chart documentation for alert configuration.
