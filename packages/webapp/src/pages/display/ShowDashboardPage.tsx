import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { ChartWrapper, ColorSchemeProvider, RenderChart, type FieldDataType } from "graph-italia-components";
import { Responsive, WidthProvider } from "react-grid-layout/legacy";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import Layout from "../../components/layout";
import Loading from "../../components/layout/Loading";
import TextSlot from "../../components/TextSlot";
import type { TLayoutItem } from "../../lib/store/dashboard-edit.store";
import { toSingleColumn } from "../../lib/dashboardLayout";
import useDashboardViewStore from "../../lib/store/dashboard-view.store";
import { useSettingsStore } from "../../lib/store/settings_store";
import { isPublishingEnabled } from "../../lib/api";
import { useChartA11yProps } from "../../hooks/useChartA11yProps";
import { useCopyLink } from "../../hooks/useCopyLink";
import { toWrapperProps, withWrapperDefaults, type ChartWrapperSettings } from "../../lib/chartWrapper";
import { ROUTES } from "../../router";

const TOTAL_COLS = 12;
const ALL_COLS = { lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 };
const BREAKPOINTS = { lg: 1200, md: 768, sm: 480, xs: 320, xxs: 0 };
const ROW_HEIGHT = 380;
// Rows of a grid with at least one wrapped chart: the wrapper's heading, tabs
// and buttons take room from the chart.
const WRAPPED_ROW_HEIGHT = ROW_HEIGHT + 120;
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

// Below this the chart panel of a wrapped slot stops shrinking and the slot scrolls.
const MIN_WRAPPER_PANEL = 120;

/**
 * A chart shown with its ChartWrapper inside a dashboard slot. The slot height
 * is fixed by the grid, while the wrapper adds heading, tabs and buttons whose
 * height depends on texts, buttons and width: measure them and give the chart
 * panel what is left. Should the content still be taller, the slot scrolls.
 */
function WrappedSlotChart({
  chart,
  wrapper,
  scheme,
  onShare,
  a11y,
}: {
  chart: FieldDataType;
  wrapper: ChartWrapperSettings;
  scheme: React.ComponentProps<typeof ColorSchemeProvider>["scheme"];
  onShare: () => void;
  a11y: ReturnType<typeof useChartA11yProps>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [panel, setPanel] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const container = el.querySelector<HTMLElement>(".cw-container");
      const panels = el.querySelector<HTMLElement>(".cw-panels");
      if (!container || !panels) return;
      // scrollHeight: .cw-container has max-height 100%, so source and buttons
      // overflow it instead of making it taller.
      const chrome = container.scrollHeight - panels.offsetHeight;
      const next = Math.max(MIN_WRAPPER_PANEL, Math.floor(el.clientHeight - chrome));
      setPanel((current) => (current !== null && Math.abs(current - next) <= 1 ? current : next));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    const container = el.querySelector(".cw-container");
    if (container) observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    // Direct child of the grid item, which has the slot height: what is
    // measured here is the room the slot offers.
    <div ref={ref} className="h-full overflow-y-auto">
      <ColorSchemeProvider scheme={scheme}>
        <ChartWrapper
          // ChartWrapper reads config.h: a chart saved without config must not break the page
          data={{ ...chart, config: chart.config ?? ({} as FieldDataType["config"]), ...a11y }}
          {...toWrapperProps(wrapper, onShare)}
          rowHeight={panel ?? MIN_WRAPPER_PANEL}
          hFactor={1}
        />
      </ColorSchemeProvider>
    </div>
  );
}

function DashboardViewPage() {
  const chartA11y = useChartA11yProps();
  const { id } = useParams();
  const { load, layout, charts, name, description, isLoading, loaded, preview, wrapCharts, singleColumn, error } =
    useDashboardViewStore();
  const { t } = useTranslation("pages");
  const copyLink = useCopyLink();

  React.useEffect(() => {
    if (id) load(id);
  }, [id, load]);

  const { settings } = useSettingsStore();
  const scheme = settings?.preferredTheme ?? "light";

  const segments = useMemo(
    () =>
      segmentLayout(
        singleColumn ? toSingleColumn(layout) : layout,
        (item) =>
          (charts[item.i] as { chart?: string } | undefined)?.chart === "text" &&
          item.w >= 3,
      ),
    [layout, charts, singleColumn],
  );

  type SlotChart = FieldDataType & {
    chart?: string;
    config?: { content?: string };
    wrapper?: ChartWrapperSettings | null;
  };

  // Wrapper settings of a slot's chart, or null when it is shown bare. The
  // dashboard switch wraps every chart, with the chart's own settings (even
  // when its wrapper is off) or the defaults; text blocks are never wrapped.
  function slotWrapper(chart: SlotChart | undefined): ChartWrapperSettings | null {
    if (!chart || chart.chart === "text") return null;
    if (wrapCharts) return withWrapperDefaults({ ...chart.wrapper, enabled: true });
    return chart.wrapper?.enabled ? chart.wrapper : null;
  }

  function renderSlot(item: TLayoutItem, rowHeight: number) {
    const currentChart = charts[item.i] as SlotChart;
    const chartHeight = ((rowHeight * item.h) - (MARGIN * (item.h)) - TABBAR);
    const wrapper = slotWrapper(currentChart);

    return (
      <div
        key={item.i}
        className="overflow-hidden rounded-lg bg-base-100 border border-base-200 shadow-sm"
      >
        {currentChart &&
          (currentChart.chart === "text" ? (
            <TextSlot content={currentChart.config?.content ?? ""} />
          ) : wrapper ? (
            <WrappedSlotChart
              chart={currentChart}
              wrapper={wrapper}
              scheme={scheme}
              onShare={() =>
                copyLink(`${window.location.origin}${ROUTES.viewChart(currentChart.id ?? "")}`)
              }
              a11y={chartA11y}
            />
          ) : (
            <ColorSchemeProvider scheme={scheme}>
              <RenderChart
                {...currentChart}
                rowHeight={chartHeight}
                hFactor={1}
                {...chartA11y}
              />
            </ColorSchemeProvider>
          ))}
      </div>
    );
  }

  function renderGrid(items: TLayoutItem[], index: number) {
    // One row height per grid: taller when any of its charts is wrapped
    const rowHeight = items.some((item) => slotWrapper(charts[item.i] as SlotChart))
      ? WRAPPED_ROW_HEIGHT
      : ROW_HEIGHT;
    return (
      <ResponsiveGrid
        key={`grid-${index}`}
        layouts={buildLayouts(items)}
        breakpoints={BREAKPOINTS}
        cols={ALL_COLS}
        rowHeight={rowHeight}
        margin={[MARGIN, MARGIN]}
        containerPadding={[0, 0]}
        isDraggable={false}
        isResizable={false}
      >
        {items.map((item) => renderSlot(item, rowHeight))}
      </ResponsiveGrid>
    );
  }

  return (
    <Layout>
      <div className="px-4 lg:px-10 py-6">

        {preview && (
          <div role="status" className="alert alert-info mb-4">
            <span>
              {isPublishingEnabled()
                ? t("publicChart.privatePreviewNotice")
                : t("publicChart.previewNotice")}
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
                  renderGrid(segment.items, index)
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
