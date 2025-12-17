import { Hono } from 'hono';
import { createMiddleware } from 'hono/factory';

// ═══════════════════════════════════════════════════════════════════════════════
// 📊 PROMETHEUS METRICS
// ═══════════════════════════════════════════════════════════════════════════════
// Expose metrics in Prometheus format for scraping
// Because what gets measured gets managed (and looks cool in Grafana)
// ═══════════════════════════════════════════════════════════════════════════════

// Simple counter/gauge/histogram implementations
// (avoiding prom-client dependency for Bun compatibility)

interface MetricLabels {
  [key: string]: string;
}

class Counter {
  private name: string;
  private help: string;
  private labelNames: string[];
  private values: Map<string, number> = new Map();

  constructor(name: string, help: string, labelNames: string[] = []) {
    this.name = name;
    this.help = help;
    this.labelNames = labelNames;
  }

  inc(labels: MetricLabels = {}, value: number = 1) {
    const key = this.labelsToKey(labels);
    this.values.set(key, (this.values.get(key) || 0) + value);
  }

  private labelsToKey(labels: MetricLabels): string {
    return this.labelNames.map(n => labels[n] || '').join('|');
  }

  format(): string {
    let output = `# HELP ${this.name} ${this.help}\n`;
    output += `# TYPE ${this.name} counter\n`;
    
    if (this.values.size === 0) {
      output += `${this.name} 0\n`;
    } else {
      this.values.forEach((value, key) => {
        const labelValues = key.split('|');
        if (this.labelNames.length > 0) {
          const labelStr = this.labelNames
            .map((name, i) => `${name}="${labelValues[i] || ''}"`)
            .join(',');
          output += `${this.name}{${labelStr}} ${value}\n`;
        } else {
          output += `${this.name} ${value}\n`;
        }
      });
    }
    return output;
  }
}

class Gauge {
  private name: string;
  private help: string;
  private labelNames: string[];
  private values: Map<string, number> = new Map();

  constructor(name: string, help: string, labelNames: string[] = []) {
    this.name = name;
    this.help = help;
    this.labelNames = labelNames;
  }

  set(labels: MetricLabels, value: number) {
    const key = this.labelsToKey(labels);
    this.values.set(key, value);
  }

  inc(labels: MetricLabels = {}, value: number = 1) {
    const key = this.labelsToKey(labels);
    this.values.set(key, (this.values.get(key) || 0) + value);
  }

  dec(labels: MetricLabels = {}, value: number = 1) {
    const key = this.labelsToKey(labels);
    this.values.set(key, (this.values.get(key) || 0) - value);
  }

  private labelsToKey(labels: MetricLabels): string {
    return this.labelNames.map(n => labels[n] || '').join('|');
  }

  format(): string {
    let output = `# HELP ${this.name} ${this.help}\n`;
    output += `# TYPE ${this.name} gauge\n`;
    
    if (this.values.size === 0) {
      output += `${this.name} 0\n`;
    } else {
      this.values.forEach((value, key) => {
        const labelValues = key.split('|');
        if (this.labelNames.length > 0) {
          const labelStr = this.labelNames
            .map((name, i) => `${name}="${labelValues[i] || ''}"`)
            .join(',');
          output += `${this.name}{${labelStr}} ${value}\n`;
        } else {
          output += `${this.name} ${value}\n`;
        }
      });
    }
    return output;
  }
}

class Histogram {
  private name: string;
  private help: string;
  private labelNames: string[];
  private buckets: number[];
  private counts: Map<string, number[]> = new Map();
  private sums: Map<string, number> = new Map();
  private totals: Map<string, number> = new Map();

  constructor(name: string, help: string, labelNames: string[] = [], buckets: number[] = [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10]) {
    this.name = name;
    this.help = help;
    this.labelNames = labelNames;
    this.buckets = buckets.sort((a, b) => a - b);
  }

  observe(labels: MetricLabels, value: number) {
    const key = this.labelsToKey(labels);
    
    // Initialize if needed
    if (!this.counts.has(key)) {
      this.counts.set(key, new Array(this.buckets.length).fill(0));
      this.sums.set(key, 0);
      this.totals.set(key, 0);
    }

    // Increment bucket counts
    const counts = this.counts.get(key)!;
    for (let i = 0; i < this.buckets.length; i++) {
      if (value <= this.buckets[i]) {
        counts[i]++;
      }
    }

    // Update sum and total
    this.sums.set(key, this.sums.get(key)! + value);
    this.totals.set(key, this.totals.get(key)! + 1);
  }

  private labelsToKey(labels: MetricLabels): string {
    return this.labelNames.map(n => labels[n] || '').join('|');
  }

  format(): string {
    let output = `# HELP ${this.name} ${this.help}\n`;
    output += `# TYPE ${this.name} histogram\n`;

    this.counts.forEach((counts, key) => {
      const labelValues = key.split('|');
      const baseLabelStr = this.labelNames.length > 0
        ? this.labelNames.map((name, i) => `${name}="${labelValues[i] || ''}"`).join(',') + ','
        : '';

      // Bucket values (cumulative)
      let cumulative = 0;
      for (let i = 0; i < this.buckets.length; i++) {
        cumulative += counts[i];
        output += `${this.name}_bucket{${baseLabelStr}le="${this.buckets[i]}"} ${cumulative}\n`;
      }
      output += `${this.name}_bucket{${baseLabelStr}le="+Inf"} ${this.totals.get(key)}\n`;
      output += `${this.name}_sum{${baseLabelStr.slice(0, -1)}} ${this.sums.get(key)}\n`;
      output += `${this.name}_count{${baseLabelStr.slice(0, -1)}} ${this.totals.get(key)}\n`;
    });

    return output;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📈 METRICS REGISTRY
// ═══════════════════════════════════════════════════════════════════════════════

// HTTP request metrics
export const httpRequestsTotal = new Counter(
  'http_requests_total',
  'Total number of HTTP requests',
  ['method', 'path', 'status']
);

export const httpRequestDuration = new Histogram(
  'http_request_duration_seconds',
  'HTTP request duration in seconds',
  ['method', 'path'],
  [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10]
);

export const httpRequestsInFlight = new Gauge(
  'http_requests_in_flight',
  'Number of HTTP requests currently being processed',
  []
);

// Application metrics
export const activeUsers = new Gauge(
  'dataviz_active_sessions',
  'Number of active user sessions',
  []
);

export const chartsCreated = new Counter(
  'dataviz_charts_created_total',
  'Total number of charts created',
  []
);

export const dashboardsCreated = new Counter(
  'dataviz_dashboards_created_total',
  'Total number of dashboards created',
  []
);

export const emailsSent = new Counter(
  'dataviz_emails_sent_total',
  'Total number of emails sent',
  ['type']
);

export const aiRequests = new Counter(
  'dataviz_ai_requests_total',
  'Total number of AI suggestion requests',
  ['status']
);

export const dbQueryDuration = new Histogram(
  'dataviz_db_query_duration_seconds',
  'Database query duration in seconds',
  ['operation'],
  [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5]
);

// Process metrics
const startTime = Date.now();
export const processUptime = new Gauge(
  'process_uptime_seconds',
  'Process uptime in seconds',
  []
);

export const processMemory = new Gauge(
  'process_memory_bytes',
  'Process memory usage in bytes',
  ['type']
);

// ═══════════════════════════════════════════════════════════════════════════════
// 🔌 METRICS MIDDLEWARE
// ═══════════════════════════════════════════════════════════════════════════════

// Paths to exclude from metrics (to avoid metric explosion)
const EXCLUDED_PATHS = ['/metrics', '/health', '/healthz', '/ready', '/live'];

export const metricsMiddleware = createMiddleware(async (c, next) => {
  const path = c.req.path;
  
  // Skip metrics for excluded paths
  if (EXCLUDED_PATHS.some(p => path === p || path.startsWith(p))) {
    await next();
    return;
  }

  // Normalize path for metrics (replace IDs with :id)
  const normalizedPath = path
    .replace(/\/[a-f0-9-]{36}/gi, '/:id')  // UUIDs
    .replace(/\/[a-z0-9]{20,}/gi, '/:id')  // CUIDs and similar
    .replace(/\/\d+/g, '/:id');             // Numeric IDs

  httpRequestsInFlight.inc();
  const startTime = performance.now();

  await next();

  const duration = (performance.now() - startTime) / 1000; // Convert to seconds
  const status = c.res.status;
  const statusClass = `${Math.floor(status / 100)}xx`;

  httpRequestsTotal.inc({ method: c.req.method, path: normalizedPath, status: statusClass });
  httpRequestDuration.observe({ method: c.req.method, path: normalizedPath }, duration);
  httpRequestsInFlight.dec();
});

// ═══════════════════════════════════════════════════════════════════════════════
// 📤 METRICS ENDPOINT
// ═══════════════════════════════════════════════════════════════════════════════

function collectProcessMetrics() {
  // Update uptime
  processUptime.set({}, (Date.now() - startTime) / 1000);

  // Update memory (Bun's process.memoryUsage())
  if (typeof process.memoryUsage === 'function') {
    const mem = process.memoryUsage();
    processMemory.set({ type: 'heap_used' }, mem.heapUsed);
    processMemory.set({ type: 'heap_total' }, mem.heapTotal);
    processMemory.set({ type: 'rss' }, mem.rss);
    processMemory.set({ type: 'external' }, mem.external || 0);
  }
}

export function getMetrics(): string {
  collectProcessMetrics();

  const metrics = [
    httpRequestsTotal,
    httpRequestDuration,
    httpRequestsInFlight,
    activeUsers,
    chartsCreated,
    dashboardsCreated,
    emailsSent,
    aiRequests,
    dbQueryDuration,
    processUptime,
    processMemory,
  ];

  return metrics.map(m => m.format()).join('\n');
}

// Create metrics router
export const metricsRouter = new Hono();

metricsRouter.get('/', (c) => {
  c.header('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
  return c.text(getMetrics());
});

export default metricsRouter;

