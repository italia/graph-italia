import React, { useEffect, useReducer } from "react";
import RenderDashboard from "../components/RenderDashboard";
import type { DashboardData } from "../components/RenderDashboard";
import { ColorSchemeProvider } from "./ColorSchemeContext";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DashboardProviderProps {
  /** API key with dv_ prefix generated in project settings. */
  apiKey: string;
  /** Base URL of the Graph Italia server (no trailing slash). */
  endpoint: string;
  /** ID of the dashboard to fetch and render. */
  dashboardId: string;
  /** API route prefix. Defaults to "/api". */
  routePrefix?: string;
  /** Base row height in px passed to RenderDashboard. Defaults to 380. */
  rowHeight?: number;
  /** Gap between slots in px. Defaults to 16. */
  margin?: number;
  /** Show dashboard name and description heading. Defaults to true. */
  showHeading?: boolean;
  /**
   * When true, wraps the output in ColorSchemeProvider which auto-detects
   * the user's prefers-color-scheme media query. Defaults to false.
   */
  detectUserPrefColorsSchema?: boolean;
  withWrapper?: boolean;
  /** When true, renders the PoweredBy footer on each chart. Defaults to false. */
  showPoweredBy?: boolean;
  /**
   * When true, the data table tab and the data download of each chart use a
   * transposed version of the chart data. The chart itself always renders
   * the data untransposed. Defaults to false.
   */
  showDataTransposed?: boolean;
  /** Custom loading element. Renders a minimal spinner by default. */
  loadingElement?: React.ReactNode;
  /** Custom error renderer. Receives the error message string. */
  errorElement?: (message: string) => React.ReactNode;
}

// ── State machine ─────────────────────────────────────────────────────────────

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; dashboard: DashboardData }
  | { status: "error"; message: string };

type Action =
  | { type: "FETCH" }
  | { type: "OK"; dashboard: DashboardData }
  | { type: "ERR"; message: string };

function reducer(_: State, action: Action): State {
  switch (action.type) {
    case "FETCH": return { status: "loading" };
    case "OK": return { status: "success", dashboard: action.dashboard };
    case "ERR": return { status: "error", message: action.message };
  }
}

// ── Default UI slots ──────────────────────────────────────────────────────────

function DefaultLoader() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 120,
        width: "100%",
      }}
      role="status"
      aria-label="Loading dashboard"
    >
      <svg
        width={32}
        height={32}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        style={{ opacity: 0.4, animation: "spin 1s linear infinite" }}
        aria-hidden="true"
      >
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    </div>
  );
}

function DefaultError({ message }: { message: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "12px 16px",
        borderRadius: 8,
        background: "rgba(239,68,68,0.08)",
        border: "1px solid rgba(239,68,68,0.25)",
        color: "#b91c1c",
        fontSize: 14,
        width: "100%",
        boxSizing: "border-box",
      }}
      role="alert"
    >
      <svg width={16} height={16} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
          clipRule="evenodd"
        />
      </svg>
      {message}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Fetches a dashboard from the Graph Italia server using an API key and
 * renders all its chart slots in a responsive grid.
 *
 * @example
 * <DashboardProvider
 *   apiKey="dv_your_project_key"
 *   endpoint="https://your-server-api.com"
 *   dashboardId="unique-dashboard-id-123"
 * />
 *
 * @example
 * // With system color scheme detection
 * <DashboardProvider
 *   apiKey="dv_your_project_key"
 *   endpoint="https://your-server-api.com"
 *   dashboardId="unique-dashboard-id-123"
 *   detectUserPrefColorsSchema
 * />
 */
export function DashboardProvider({
  apiKey,
  endpoint,
  dashboardId,
  routePrefix = "/api",
  rowHeight,
  margin,
  showHeading,
  detectUserPrefColorsSchema = false,
  withWrapper = true,
  showPoweredBy = false,
  showDataTransposed = false,
  loadingElement,
  errorElement,
}: DashboardProviderProps) {
  const [state, dispatch] = useReducer(reducer, { status: "idle" });

  useEffect(() => {
    if (!apiKey || !endpoint || !dashboardId) return;

    const controller = new AbortController();
    const url = `${endpoint.replace(/\/$/, "")}${routePrefix}/dashboards/${dashboardId}`;

    dispatch({ type: "FETCH" });

    fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error((body as any)?.error ?? `HTTP ${res.status}`);
        }
        return res.json() as Promise<DashboardData>;
      })
      .then((dashboard) => dispatch({ type: "OK", dashboard }))
      .catch((err) => {
        if (err.name === "AbortError") return;
        dispatch({ type: "ERR", message: err instanceof Error ? err.message : "Unknown error" });
      });

    return () => controller.abort();
  }, [apiKey, endpoint, dashboardId, routePrefix]);

  if (state.status === "idle" || state.status === "loading") {
    return <>{loadingElement ?? <DefaultLoader />}</>;
  }

  if (state.status === "error") {
    return (
      <>
        {errorElement
          ? errorElement(state.message)
          : <DefaultError message={state.message} />}
      </>
    );
  }

  const content = (
    <RenderDashboard
      data={state.dashboard}
      rowHeight={rowHeight}
      margin={margin}
      showHeading={showHeading}
      withWrapper={withWrapper}
      showPoweredBy={showPoweredBy}
      showDataTransposed={showDataTransposed}
    />
  );

  if (detectUserPrefColorsSchema) {
    return <ColorSchemeProvider>{content}</ColorSchemeProvider>;
  }

  return content;
}

export default DashboardProvider;
