import React, { useEffect, useRef, useState } from "react";
import type { FieldDataType, InfosType } from "../types";
import RenderChart from "./RenderChart";
import ChartWrapper from "./chartwrapper/ChartWrapper";
import type { WrapperFuncts } from "./RenderDashboard";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DashboardSlot {
  settings: {
    i: string;
    x: number;
    y: number;
    /** Span bucket: 1 = narrow (~1/3), 2 = medium (~2/3), 3 = full width */
    w: number;
    /** Row height multiplier */
    h: number;
  };
  chart: FieldDataType;
}

export interface DashboardData {
  id?: string;
  name?: string;
  description?: string;
  publish?: boolean;
  slots: DashboardSlot[];
}

export interface RenderDashboardProps {
  data: DashboardData;
  /** Base row height in px. Defaults to 380. */
  rowHeight?: number;
  /** Gap between slots in px. Defaults to 16. */
  margin?: number;
  /** Show dashboard name and description heading. Defaults to true. */
  showHeading?: boolean;
  /**
   * When true, renders each chart inside ChartWrapper (tabs, download,
   * data table, info panel) instead of a bare RenderChart. Defaults to false.
   */
  withWrapper?: boolean;
  /** When true, renders the PoweredBy footer on each chart. Defaults to false. */
  showPoweredBy?: boolean;
  /**
   * When true, the data table tab and the data download of each chart use a
   * transposed version of the chart data. The chart itself always renders
   * the data untransposed. Defaults to false.
   */
  showDataTransposed?: boolean;
  /**
   * Extra info merged into each chart's ChartWrapper info (labels, source
   * text, footer text, etc.). Applied on top of the per-chart name/description
   * defaults. Only used when withWrapper is true.
   */
  wrapperLabels?: Partial<InfosType>;
  /**
   * ChartWrapper behavior flags/handlers applied to every chart:
   * enableDownloadImage, enableDownloadData, shareFunction, showHeading.
   * Only used when withWrapper is true.
   */
  wrapperFuncts?: WrapperFuncts;
}

// ── Responsive breakpoints ────────────────────────────────────────────────────

// Mirrors EmbedDashboardPage SPAN_UNITS: w=1 → narrow, w=2 → medium, w=3 → full
const SPAN_UNITS: Record<string, number[]> = {
  lg: [4, 8, 12],   // >= 1200
  md: [6, 12, 12],  // >= 768
  sm: [12, 12, 12], // < 768
};

function getBreakpoint(width: number): string {
  if (width >= 1200) return "lg";
  if (width >= 768) return "md";
  return "sm";
}

function toColSpan(w: number, bp: string): number {
  return (SPAN_UNITS[bp] ?? SPAN_UNITS.sm)[Math.min(w, 3) - 1] ?? 12;
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Renders a dashboard from pre-fetched data.
 * Slots are arranged in a 12-column responsive grid that mirrors
 * the EmbedDashboardPage layout logic.
 */
export function RenderGridDashboard({
  data,
  rowHeight = 380,
  margin = 16,
  showHeading = true,
  withWrapper = false,
  showPoweredBy = false,
  showDataTransposed = false,
  wrapperLabels = {},
  wrapperFuncts = {},
}: RenderDashboardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(1200);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setContainerWidth(el.clientWidth || 1200);
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const bp = getBreakpoint(containerWidth);

  // Sort slots by reading order (top → bottom, left → right)
  const sorted = [...data.slots].sort((a, b) =>
    a.settings.y !== b.settings.y
      ? a.settings.y - b.settings.y
      : a.settings.x - b.settings.x
  );

  return (
    <div ref={containerRef}>
      {showHeading && data.name && (
        <h2
          style={{
            margin: `0 0 ${margin / 2}px`,
            fontSize: "1.5rem",
            fontWeight: 700,
            lineHeight: 1.3,
          }}
        >
          {data.name}
        </h2>
      )}
      {showHeading && data.description && (
        <p
          style={{
            margin: `0 0 ${margin}px`,
            fontSize: "1rem",
            opacity: 0.7,
          }}
        >
          {data.description}
        </p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: margin,
        }}
      >
        {sorted.map(({ settings, chart }) => {
          const colSpan = toColSpan(settings.w, bp);
          const slotHeight =
            rowHeight * settings.h + margin * (settings.h - 1);
          return (
            <div
              key={settings.i}
              style={{
                gridColumn: `span ${colSpan}`,
                overflow: withWrapper ? "visible" : "hidden",
                borderRadius: 8,
                border: "1px solid rgba(128,128,128,0.15)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                ...(withWrapper ? { minHeight: slotHeight } : { height: slotHeight }),
              }}
            >
              {withWrapper ? (
                <ChartWrapper
                  data={chart}
                  info={{
                    text: chart.description ?? "",
                    title: chart.name ?? "",
                    subTitle: "",
                    ...wrapperLabels,
                  }}
                  rowHeight={slotHeight}
                  hFactor={1}
                  showPoweredBy={showPoweredBy}
                  showDataTransposed={showDataTransposed}
                  {...wrapperFuncts}
                />
              ) : (
                <RenderChart
                  {...chart}
                  rowHeight={slotHeight}
                  hFactor={1}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RenderGridDashboard;
