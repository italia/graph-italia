import { createMiddleware } from 'hono/factory';
import type { Context } from 'hono';

// ═══════════════════════════════════════════════════════════════════════════════
// 🔮 DATAVIZ STRUCTURED LOGGER
// ═══════════════════════════════════════════════════════════════════════════════
// A nerd-friendly JSON logger that captures the essence of each request
// without exposing your deepest secrets (API keys, tokens, etc.)
// ═══════════════════════════════════════════════════════════════════════════════

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  service: string;
  version: string;
  environment: string;
  message: string;
  // Request context
  request?: {
    id: string;
    method: string;
    path: string;
    query?: Record<string, string>;
    userAgent?: string;
    ip?: string;
    contentLength?: number;
  };
  // Response context
  response?: {
    status: number;
    duration_ms: number;
    contentLength?: number;
  };
  // User context (if authenticated)
  user?: {
    id?: string;
    email?: string;
  };
  // Error context
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  // Extra metadata
  meta?: Record<string, unknown>;
}

// Paths to exclude from logging (healthchecks, metrics)
const EXCLUDED_PATHS = [
  '/api',           // healthcheck
  '/api/',          // healthcheck with slash
  '/metrics',       // prometheus metrics
  '/health',        // explicit health endpoint
  '/healthz',       // k8s health endpoint
  '/ready',         // readiness probe
  '/live',          // liveness probe
];

// Headers that should never be logged
const REDACTED_HEADERS = [
  'authorization',
  'cookie',
  'x-api-key',
  'x-auth-token',
];

// Generate a short request ID
function generateRequestId(): string {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

// Safely extract query params without sensitive data
function safeQueryParams(url: string): Record<string, string> | undefined {
  try {
    const urlObj = new URL(url, 'http://localhost');
    const params: Record<string, string> = {};
    urlObj.searchParams.forEach((value, key) => {
      // Redact potentially sensitive query params
      if (['token', 'key', 'secret', 'password', 'auth'].some(s => key.toLowerCase().includes(s))) {
        params[key] = '[REDACTED]';
      } else {
        params[key] = value;
      }
    });
    return Object.keys(params).length > 0 ? params : undefined;
  } catch {
    return undefined;
  }
}

// Format log entry as JSON
function formatLog(entry: LogEntry): string {
  return JSON.stringify(entry);
}

// The logger class
class Logger {
  private service: string;
  private version: string;
  private environment: string;

  constructor() {
    this.service = 'dataviz-server';
    this.version = process.env.APP_VERSION || '0.0.0-dev';
    this.environment = process.env.NODE_ENV || 'development';
  }

  private baseEntry(level: LogLevel, message: string): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      service: this.service,
      version: this.version,
      environment: this.environment,
      message,
    };
  }

  debug(message: string, meta?: Record<string, unknown>) {
    if (this.environment === 'production') return;
    const entry = this.baseEntry('debug', message);
    if (meta) entry.meta = meta;
    console.log(formatLog(entry));
  }

  info(message: string, meta?: Record<string, unknown>) {
    const entry = this.baseEntry('info', message);
    if (meta) entry.meta = meta;
    console.log(formatLog(entry));
  }

  warn(message: string, meta?: Record<string, unknown>) {
    const entry = this.baseEntry('warn', message);
    if (meta) entry.meta = meta;
    console.warn(formatLog(entry));
  }

  error(message: string, error?: Error, meta?: Record<string, unknown>) {
    const entry = this.baseEntry('error', message);
    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: this.environment !== 'production' ? error.stack : undefined,
      };
    }
    if (meta) entry.meta = meta;
    console.error(formatLog(entry));
  }

  // Log HTTP request/response
  http(entry: Partial<LogEntry>) {
    const fullEntry: LogEntry = {
      ...this.baseEntry('info', 'HTTP Request'),
      ...entry,
    };
    console.log(formatLog(fullEntry));
  }
}

export const logger = new Logger();

// ═══════════════════════════════════════════════════════════════════════════════
// 🌐 HTTP LOGGING MIDDLEWARE
// ═══════════════════════════════════════════════════════════════════════════════
// Captures request/response details in glorious JSON format
// Skips healthchecks because nobody wants to see those 10000 times
// ═══════════════════════════════════════════════════════════════════════════════

export const httpLogger = createMiddleware(async (c, next) => {
  const path = c.req.path;
  
  // Skip logging for healthchecks and metrics
  if (EXCLUDED_PATHS.some(p => path === p || path.startsWith(p + '/'))) {
    await next();
    return;
  }

  const requestId = generateRequestId();
  const startTime = performance.now();

  // Store request ID in context for correlation
  c.set('requestId', requestId);

  // Capture request details
  const request = {
    id: requestId,
    method: c.req.method,
    path: path,
    query: safeQueryParams(c.req.url),
    userAgent: c.req.header('user-agent'),
    ip: c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown',
    contentLength: c.req.header('content-length') ? parseInt(c.req.header('content-length')!) : undefined,
  };

  await next();

  const duration = performance.now() - startTime;
  const status = c.res.status;

  // Determine log level based on status code
  const level: LogLevel = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info';

  // Get user from context if authenticated
  const user = c.get('user') as { userId?: string; name?: string } | undefined;

  // Build response details
  const response = {
    status,
    duration_ms: Math.round(duration * 100) / 100,
    contentLength: c.res.headers.get('content-length') 
      ? parseInt(c.res.headers.get('content-length')!) 
      : undefined,
  };

  // Log the request
  logger.http({
    level,
    message: `${request.method} ${request.path} ${status} ${response.duration_ms}ms`,
    request,
    response,
    user: user ? { id: user.userId, email: user.name } : undefined,
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 🚀 STARTUP BANNER
// ═══════════════════════════════════════════════════════════════════════════════
// Because every good server needs a fancy startup message
// ═══════════════════════════════════════════════════════════════════════════════

export function logStartup() {
  logger.info('Server starting up', {
    config: {
      port: process.env.PORT || 3003,
      host: process.env.HOST || 'localhost',
      routes_prefix: process.env.ROUTES_PREFIX || '/',
      domains: process.env.DOMAINS || 'localhost',
    },
    integrations: {
      database: !!process.env.DATABASE_URL,
      jwt: !!process.env.JWT_SECRET,
      email: !!process.env.RESEND_API_KEY,
      ai: !!process.env.OPENAI_API_KEY,
    },
  });
}

export default logger;

