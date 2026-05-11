import React, { useMemo } from "react";
import { Responsive, WidthProvider } from "react-grid-layout/legacy";
import type { FieldDataType } from "../types";
import RenderChart from "./RenderChart";

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
}

// ── Grid config ───────────────────────────────────────────────────────────────

const TOTAL_COLS = 12;
const ALL_COLS = { lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 };
const BREAKPOINTS = { lg: 1200, md: 768, sm: 480, xs: 320, xxs: 0 };

const SPAN_UNITS: Record<string, number[]> = {
  lg: [4, 8, 12],
  md: [6, 12, 12],
  sm: [12, 12, 12],
  xs: [12, 12, 12],
  xxs: [12, 12, 12],
};

function toGridW(span: number, bp: string): number {
  return (SPAN_UNITS[bp] ?? SPAN_UNITS.sm)[Math.min(span, 3) - 1] ?? TOTAL_COLS;
}

type TLayoutItem = { i: string; x: number; y: number; w: number; h: number };

function buildLayouts(items: TLayoutItem[]) {
  const lgRgl = items.map((item) => ({
    i: item.i,
    x: item.x,
    y: item.y,
    w: toGridW(item.w, "lg"),
    h: item.h,
  }));

  function packBp(bp: string) {
    const sorted = [...items].sort((a, b) =>
      a.y !== b.y ? a.y - b.y : a.x - b.x
    );
    let x = 0, y = 0, rowMaxH = 1;
    return sorted.map((item) => {
      const w = toGridW(item.w, bp);
      if (x + w > TOTAL_COLS) {
        x = 0;
        y += rowMaxH;
        rowMaxH = item.h;
      } else {
        rowMaxH = Math.max(rowMaxH, item.h);
      }
      const out = { i: item.i, x, y, w, h: item.h };
      x += w;
      return out;
    });
  }

  return {
    lg: lgRgl,
    md: packBp("md"),
    sm: packBp("sm"),
    xs: packBp("xs"),
    xxs: packBp("xxs"),
  };
}

const ResponsiveGrid = WidthProvider(Responsive);

// ── Component ─────────────────────────────────────────────────────────────────

export function RenderDashboard({
  data,
  rowHeight = 380,
  margin = 16,
  showHeading = true,
}: RenderDashboardProps) {
  const { layouts, items, chartMap } = useMemo(() => {
    const items: TLayoutItem[] = data.slots.map(({ settings }) => ({
      i: settings.i,
      x: settings.x,
      y: settings.y,
      w: settings.w,
      h: settings.h,
    }));
    const chartMap = data.slots.reduce<Record<string, FieldDataType>>(
      (acc, { settings, chart }) => { acc[settings.i] = chart; return acc; },
      {}
    );
    return { layouts: buildLayouts(items), items, chartMap };
  }, [data.slots]);

  return (
    <div>
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

      <ResponsiveGrid
        layouts={layouts}
        breakpoints={BREAKPOINTS}
        cols={ALL_COLS}
        rowHeight={rowHeight}
        margin={[margin, margin]}
        isDraggable={false}
        isResizable={false}
      >
        {items.map((item) => {
          const chart = chartMap[item.i] as FieldDataType;
          const chartHeight = rowHeight * item.h + margin * (item.h - 1);

          return (
            <div
              key={item.i}
              style={{
                overflow: "hidden",
                borderRadius: 8,
                border: "1px solid rgba(128,128,128,0.15)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}
            >
              {chart && (
                <RenderChart
                  {...chart}
                  rowHeight={chartHeight}
                  hFactor={1}
                />
              )}
            </div>
          );
        })}
      </ResponsiveGrid>
    </div>
  );
}

export default RenderDashboard;
