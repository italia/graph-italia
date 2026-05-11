import React, { useMemo } from "react";
import { ColorSchemeProvider, RenderChart, type FieldDataType } from "graph-italia-components";
import { Responsive, WidthProvider } from "react-grid-layout/legacy";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Loading from "../../components/layout/Loading";
import useDashboardViewStore from "../../lib/store/dashboard-view.store";
import type { TLayoutItem } from "../../lib/store/dashboard-edit.store";

const TOTAL_COLS = 12;
const ALL_COLS = { lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 };
const BREAKPOINTS = { lg: 1200, md: 768, sm: 480, xs: 320, xxs: 0 };
const ROW_HEIGHT = 380;
const MARGIN = 16;

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

function EmbedDashboardPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { load, layout, charts, name, description, isLoading, loaded, error } =
    useDashboardViewStore();

  const themeParam = searchParams.get("theme");
  const scheme =
    themeParam === "dark" || themeParam === "light" ? themeParam : undefined;

  React.useEffect(() => {
    if (id) load(id);
  }, [id, load]);

  const layouts = useMemo(() => buildLayouts(layout), [layout]);

  return (
    <ColorSchemeProvider scheme={scheme}>
      <div className="p-4">

        {isLoading && <Loading />}
        {error && (
          <div role="alert" className="alert alert-error">
            <span>{error.message}</span>
          </div>
        )}

        {loaded && (
          <div>
            <h1 className="text-4xl font-bold">{name}</h1>
            <h4 className="text-xl mb-4">{description}</h4>

            <div style={{ margin: "0 auto" }}>
              <ResponsiveGrid
                layouts={layouts}
                breakpoints={BREAKPOINTS}
                cols={ALL_COLS}
                rowHeight={ROW_HEIGHT}
                margin={[MARGIN, MARGIN]}
                isDraggable={false}
                isResizable={false}
              >
                {layout.map((item) => {
                  const currentChart = charts[item.i] as FieldDataType;
                  const chartHeight = ROW_HEIGHT * item.h + MARGIN * (item.h - 1);

                  return (
                    <div
                      key={item.i}
                      className="overflow-hidden rounded-lg g-base-100 border border-base-200 shadow-sm"
                    >
                      {currentChart && (
                        <RenderChart
                          {...currentChart}
                          rowHeight={chartHeight}
                          hFactor={1}
                        />
                      )}
                    </div>
                  );
                })}
              </ResponsiveGrid>
            </div>
          </div>
        )}
      </div>
    </ColorSchemeProvider>
  );
}

export default EmbedDashboardPage;
