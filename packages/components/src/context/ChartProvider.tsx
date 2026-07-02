import React, { useEffect, useReducer } from "react";
import RenderChart from "../components/RenderChart";
import ChartWrapper from "../components/chartwrapper/ChartWrapper";
import type { FieldDataType, InfosType } from "../types";
import { ColorSchemeProvider } from "./ColorSchemeContext";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ChartProviderProps {
  /** API key with dv_ prefix generated in project settings. */
  apiKey: string;
  /** Base URL of the Graph Italia server (no trailing slash). */
  endpoint: string;
  /** ID of the chart to fetch and render. */
  chartId: string;
  /** API route prefix. Defaults to "/api". */
  routePrefix?: string;
  /** Optional height factor passed to RenderChart / ChartWrapper. */
  hFactor?: number;
  /** Optional row height passed to RenderChart / ChartWrapper. */
  rowHeight?: number;
  /** Optional label shown in the PoweredBy footer. */
  poweredByLabel?: string;
  /** When true, renders the PoweredBy footer. Defaults to false. */
  showPoweredBy?: boolean;
  /**
   * When true, renders the chart inside ChartWrapper (tabs, download,
   * data table, info panel). Defaults to true.
   */
  withWrapper?: boolean;
  /**
   * When true, the data table tab and the data download use a transposed
   * version of the chart data (rows/columns swapped). The chart itself
   * always renders the data untransposed. Defaults to false.
   */
  showDataTransposed?: boolean;
  /**
   * Extra info passed to ChartWrapper when withWrapper is true.
   * The chart's name and description are used as defaults for title/subTitle.
   */
  wrapperInfo?: Partial<InfosType>;
  /**
   * When true, wraps the output in ColorSchemeProvider which auto-detects
   * the user's prefers-color-scheme media query. Defaults to false.
   */
  detectUserPrefColorsSchema?: boolean;
  /** Custom loading element. Renders a minimal spinner by default. */
  loadingElement?: React.ReactNode;
  /** Custom error renderer. Receives the error message string. */
  errorElement?: (message: string) => React.ReactNode;
}

// ── State machine ─────────────────────────────────────────────────────────────

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; chart: FieldDataType }
  | { status: "error"; message: string };

type Action =
  | { type: "FETCH" }
  | { type: "OK"; chart: FieldDataType }
  | { type: "ERR"; message: string };

function reducer(_: State, action: Action): State {
  switch (action.type) {
    case "FETCH": return { status: "loading" };
    case "OK": return { status: "success", chart: action.chart };
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
      aria-label="Loading chart"
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

// ── Render helpers ────────────────────────────────────────────────────────────

function ChartContent({
  chart,
  withWrapper,
  wrapperInfo,
  hFactor,
  rowHeight,
  poweredByLabel,
  showPoweredBy,
  showDataTransposed,
}: {
  chart: FieldDataType;
  withWrapper: boolean;
  wrapperInfo: Partial<InfosType>;
  hFactor?: number;
  rowHeight?: number;
  poweredByLabel?: string;
  showPoweredBy?: boolean;
  showDataTransposed?: boolean;
}) {
  if (withWrapper) {
    const info: InfosType = {
      text: "",
      title: chart.name ?? "",
      subTitle: chart.description ?? "",
      poweredByLabel,
      ...wrapperInfo,
    };
    return (
      <ChartWrapper
        data={chart}
        info={info}
        hFactor={hFactor}
        rowHeight={rowHeight}
        showPoweredBy={showPoweredBy}
        showDataTransposed={showDataTransposed}
      />
    );
  }

  return (
    <RenderChart
      {...chart}
      hFactor={hFactor}
      rowHeight={rowHeight}
    />
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Fetches a chart from the Graph Italia server using an API key and renders it.
 *
 * @example
 * // Bare render
 * <ChartProvider
 *   apiKey="dv_your_project_key"
 *   endpoint="https://your-server-api.com"
 *   chartId="unique-chart-id-123"
 * />
 *
 * @example
 * // With full ChartWrapper UI and system color scheme detection
 * <ChartProvider
 *   apiKey="dv_your_project_key"
 *   endpoint="https://your-server-api.com"
 *   chartId="unique-chart-id-123"
 *   withWrapper
 *   detectUserPrefColorsSchema
 * />
 */
export function ChartProvider({
  apiKey,
  endpoint,
  chartId,
  routePrefix = "/api",
  hFactor,
  rowHeight,
  poweredByLabel,
  showPoweredBy = false,
  withWrapper = false,
  showDataTransposed = false,
  wrapperInfo = {},
  detectUserPrefColorsSchema = false,
  loadingElement,
  errorElement,
}: ChartProviderProps) {
  const [state, dispatch] = useReducer(reducer, { status: "idle" });

  useEffect(() => {
    if (!apiKey || !endpoint || !chartId) return;

    const controller = new AbortController();
    const url = `${endpoint.replace(/\/$/, "")}${routePrefix}/charts/${chartId}`;

    dispatch({ type: "FETCH" });

    fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error((body as any)?.error ?? `HTTP ${res.status}`);
        }
        return res.json() as Promise<FieldDataType>;
      })
      .then((chart) => dispatch({ type: "OK", chart }))
      .catch((err) => {
        if (err.name === "AbortError") return;
        dispatch({ type: "ERR", message: err instanceof Error ? err.message : "Unknown error" });
      });

    return () => controller.abort();
  }, [apiKey, endpoint, chartId, routePrefix]);

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
    <ChartContent
      chart={state.chart}
      withWrapper={withWrapper}
      wrapperInfo={wrapperInfo}
      hFactor={hFactor}
      rowHeight={rowHeight}
      poweredByLabel={poweredByLabel}
      showPoweredBy={showPoweredBy}
      showDataTransposed={showDataTransposed}
    />
  );

  if (detectUserPrefColorsSchema) {
    return <ColorSchemeProvider>{content}</ColorSchemeProvider>;
  }

  return content;
}

export default ChartProvider;
