import React, { useMemo } from "react";
import { ColorSchemeProvider, RenderChart, type FieldDataType } from "graph-italia-components";
import { Responsive, WidthProvider } from "react-grid-layout/legacy";
import { useParams } from "react-router-dom";
import Layout from "../../components/layout";
import Loading from "../../components/layout/Loading";
import TextSlot from "../../components/TextSlot";
import type { TLayoutItem } from "../../lib/store/dashboard-edit.store";
import useDashboardViewStore from "../../lib/store/dashboard-view.store";
import { useSettingsStore } from "../../lib/store/settings_store";
import { isPublishingEnabled } from "../../lib/api";

const TOTAL_COLS = 12;
const ALL_COLS = { lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 };
const BREAKPOINTS = { lg: 1200, md: 768, sm: 480, xs: 320, xxs: 0 };
const ROW_HEIGHT = 380;
const MARGIN = 16;
const TABBAR = 40;

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

// Full-width text slots flow outside the fixed-height grid so they take
// their natural height instead of an entire 380px row; everything else
// stays in grid segments that keep their relative layout.
type Segment =
  | { type: "text"; item: TLayoutItem }
  | { type: "grid"; items: TLayoutItem[] };

function segmentLayout(
  layout: TLayoutItem[],
  isFullWidthText: (item: TLayoutItem) => boolean,
): Segment[] {
  const sorted = [...layout].sort((a, b) =>
    a.y !== b.y ? a.y - b.y : a.x - b.x,
  );
  const segments: Segment[] = [];
  for (const item of sorted) {
    if (isFullWidthText(item)) {
      segments.push({ type: "text", item });
    } else {
      const last = segments[segments.length - 1];
      if (last?.type === "grid") last.items.push(item);
      else segments.push({ type: "grid", items: [item] });
    }
  }
  return segments;
}

function DashboardViewPage() {
  const { id } = useParams();
  const { load, layout, charts, name, description, isLoading, loaded, error } =
    useDashboardViewStore();

  React.useEffect(() => {
    if (id) load(id);
  }, [id, load]);

  const { settings } = useSettingsStore();
  const scheme = settings?.preferredTheme ?? "light";

  const segments = useMemo(
    () =>
      segmentLayout(
        layout,
        (item) =>
          (charts[item.i] as { chart?: string } | undefined)?.chart === "text" &&
          item.w >= 3,
      ),
    [layout, charts],
  );

  function renderSlot(item: TLayoutItem) {
    const currentChart = charts[item.i] as FieldDataType & {
      chart?: string;
      config?: { content?: string };
    };
    const chartHeight = ((ROW_HEIGHT * item.h) - (MARGIN * (item.h)) - TABBAR);

    return (
      <div
        key={item.i}
        className="overflow-hidden rounded-lg bg-base-100 border border-base-200 shadow-sm"
      >
        {currentChart && (
          currentChart.chart === "text" ? (
            <TextSlot content={currentChart.config?.content ?? ""} />
          ) : (
            <ColorSchemeProvider scheme={scheme}>
              <RenderChart
                {...currentChart}
                rowHeight={chartHeight}
                hFactor={1}
              />
            </ColorSchemeProvider>
          )
        )}
      </div>
    );
  }

  return (
    <Layout>
      <div className="px-4 lg:px-10 py-6">

        {!isPublishingEnabled() && (
          <div role="status" className="alert alert-info mb-4">
            <span>
              Public publishing is disabled on this instance — you're viewing an
              authenticated preview, not a public page.
            </span>
          </div>
        )}

        {isLoading && <Loading />}
        {error && (
          <div role="alert" className="alert alert-error">
            <span>{error.message}</span>
          </div>
        )}

        {loaded && (
          <div>
            <h1 className="text-2xl font-bold">{name}</h1>
            {description && (
              <p className="text-base-content/70 mt-1">{description}</p>
            )}

            <div className="mt-6 flex flex-col gap-4">
              {segments.map((segment, index) =>
                segment.type === "text" ? (
                  <div
                    key={segment.item.i}
                    className="rounded-lg bg-base-100 border border-base-200 shadow-sm"
                  >
                    <TextSlot
                      content={
                        (charts[segment.item.i] as { config?: { content?: string } })
                          ?.config?.content ?? ""
                      }
                    />
                  </div>
                ) : (
                  <ResponsiveGrid
                    key={`grid-${index}`}
                    layouts={buildLayouts(segment.items)}
                    breakpoints={BREAKPOINTS}
                    cols={ALL_COLS}
                    rowHeight={ROW_HEIGHT}
                    margin={[MARGIN, MARGIN]}
                    containerPadding={[0, 0]}
                    isDraggable={false}
                    isResizable={false}
                  >
                    {segment.items.map((item) => renderSlot(item))}
                  </ResponsiveGrid>
                ),
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default DashboardViewPage;
