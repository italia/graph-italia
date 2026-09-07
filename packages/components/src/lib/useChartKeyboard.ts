import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import type { EChartsType } from "echarts";

/**
 * Adds keyboard accessibility and focusable behavior on top of an ECharts
 * instance:
 *  - the chart container becomes focusable (tabIndex 0, role img)
 *  - on focus the tooltip is shown for the first data point of the first
 *    series, so the same information visible on mouse hover is also
 *    available with the keyboard (WCAG 2.1.1, 1.4.13)
 *  - ArrowLeft/ArrowRight cycle data points, ArrowUp/ArrowDown cycle series
 *  - every move updates `announcement` with the active point (category,
 *    series, value and position), to be rendered in a live region OUTSIDE
 *    the role="img" container: the tooltip is drawn on canvas and would
 *    otherwise be invisible to screen readers (WCAG 4.1.3)
 *  - the active point is put in the ECharts "emphasis" state (highlight
 *    action) so the keyboard position is visible on the canvas, like the
 *    hover state is for the mouse (WCAG 2.4.7); the previous point is
 *    downplayed on every move and on blur
 *  - on blur the tooltip is hidden
 *
 * Returns `containerProps` to spread on the container wrapping the chart
 * canvas, and `announcement` for the sibling live region.
 */

/** Style for the screen-reader-only live region next to the chart. */
export const chartLiveRegionStyle: CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
  border: 0,
};

type InstanceSource = EChartsType | null | (() => EChartsType | null | undefined);

export function useChartKeyboard(
  instanceSource: InstanceSource,
  ariaLabel: string,
) {
  // echarts-for-react disposes and re-creates the instance when the theme
  // changes (the colour scheme resolves after mount): a captured instance
  // goes stale silently, getOption() returns null and nothing happens. The
  // source is read lazily on every action, through a ref so the handlers
  // stay stable and the unmount cleanup does not run on every render.
  const sourceRef = useRef<InstanceSource>(instanceSource);
  sourceRef.current = instanceSource;
  const getInstance = useCallback((): EChartsType | null => {
    const src = sourceRef.current;
    const inst = typeof src === "function" ? src() : src;
    if (!inst) return null;
    if (typeof inst.isDisposed === "function" && inst.isDisposed()) return null;
    return inst;
  }, []);
  const [active, setActive] = useState<{ seriesIndex: number; dataIndex: number }>(
    { seriesIndex: 0, dataIndex: 0 },
  );
  const activeRef = useRef(active);
  activeRef.current = active;
  const [announcement, setAnnouncement] = useState("");

  const highlighted = useRef<{ seriesIndex: number; dataIndex: number } | null>(null);

  const showTip = useCallback(
    (seriesIndex: number, dataIndex: number) => {
      const echartInstance = getInstance();
      if (!echartInstance) return;
      try {
        echartInstance.dispatchAction({
          type: "showTip",
          seriesIndex,
          dataIndex,
        });
        // An axis tooltip puts every series of that category in emphasis:
        // downplay them all, then highlight only the active point so the
        // keyboard position is unambiguous.
        const count = (echartInstance.getOption() as { series?: unknown[] })?.series?.length ?? 0;
        for (let i = 0; i < count; i++) {
          echartInstance.dispatchAction({ type: "downplay", seriesIndex: i });
        }
        echartInstance.dispatchAction({ type: "highlight", seriesIndex, dataIndex });
        highlighted.current = { seriesIndex, dataIndex };
      } catch {
        /* echarts may not be ready yet */
      }
    },
    [getInstance],
  );

  const hideTip = useCallback(() => {
    const echartInstance = getInstance();
    if (!echartInstance) return;
    try {
      const prev = highlighted.current;
      if (prev) {
        echartInstance.dispatchAction({ type: "downplay", ...prev });
        highlighted.current = null;
      }
      echartInstance.dispatchAction({ type: "hideTip" });
    } catch {
      /* noop */
    }
  }, [getInstance]);

  const getSeries = useCallback((): any[] => {
    const echartInstance = getInstance();
    if (!echartInstance) return [];
    const option = echartInstance.getOption() as { series?: any[] } | undefined;
    return option?.series ?? [];
  }, [getInstance]);

  const getDataLength = useCallback(
    (seriesIndex: number): number => {
      const series = getSeries();
      const serie = series[seriesIndex];
      if (!serie) return 0;
      if (Array.isArray(serie.data)) return serie.data.length;
      return 0;
    },
    [getSeries],
  );

  useEffect(() => {
    return () => {
      hideTip();
    };
  }, [hideTip]);

  /** Text description of a data point, mirroring the canvas tooltip. */
  const describePoint = useCallback(
    (seriesIndex: number, dataIndex: number): string => {
      const series = getSeries();
      const serie = series[seriesIndex];
      if (!serie || !Array.isArray(serie.data)) return "";
      const item = serie.data[dataIndex];
      let value: unknown = item;
      let itemName: string | undefined;
      if (item && typeof item === "object" && !Array.isArray(item)) {
        value = (item as { value?: unknown }).value;
        itemName = (item as { name?: string }).name;
      }
      // Category from the category axis (bar/line); pie and map points carry
      // their own name instead.
      let category = itemName;
      const echartInstance = getInstance();
      if (!category && echartInstance) {
        try {
          const opt = echartInstance.getOption() as {
            xAxis?: any[];
            yAxis?: any[];
          };
          const axes = [...(opt.xAxis ?? []), ...(opt.yAxis ?? [])];
          const catAxis = axes.find(
            (a) => a?.type === "category" && Array.isArray(a.data),
          );
          const cat = catAxis?.data?.[dataIndex];
          if (cat != null) category = String(cat);
        } catch {
          /* noop */
        }
      }
      const label = [category, serie.name].filter(Boolean).join(", ");
      const position = `(${dataIndex + 1}/${serie.data.length})`;
      return `${label ? `${label}: ` : ""}${value ?? ""} ${position}`;
    },
    [getInstance, getSeries],
  );

  const onFocus = useCallback(() => {
    const { seriesIndex, dataIndex } = activeRef.current;
    showTip(seriesIndex, dataIndex);
    setAnnouncement(describePoint(seriesIndex, dataIndex));
  }, [showTip, describePoint]);

  const onBlur = useCallback(() => {
    hideTip();
    setAnnouncement("");
  }, [hideTip]);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const series = getSeries();
      if (series.length === 0) return;
      const current = activeRef.current;
      let { seriesIndex, dataIndex } = current;
      let handled = false;

      switch (event.key) {
        case "ArrowRight": {
          const len = getDataLength(seriesIndex);
          if (len > 0) {
            dataIndex = (dataIndex + 1) % len;
            handled = true;
          }
          break;
        }
        case "ArrowLeft": {
          const len = getDataLength(seriesIndex);
          if (len > 0) {
            dataIndex = (dataIndex - 1 + len) % len;
            handled = true;
          }
          break;
        }
        case "ArrowDown": {
          if (series.length > 1) {
            seriesIndex = (seriesIndex + 1) % series.length;
            const len = getDataLength(seriesIndex);
            if (dataIndex >= len) dataIndex = Math.max(0, len - 1);
            handled = true;
          }
          break;
        }
        case "ArrowUp": {
          if (series.length > 1) {
            seriesIndex = (seriesIndex - 1 + series.length) % series.length;
            const len = getDataLength(seriesIndex);
            if (dataIndex >= len) dataIndex = Math.max(0, len - 1);
            handled = true;
          }
          break;
        }
        case "Home": {
          dataIndex = 0;
          handled = true;
          break;
        }
        case "End": {
          const len = getDataLength(seriesIndex);
          if (len > 0) {
            dataIndex = len - 1;
            handled = true;
          }
          break;
        }
        case "Escape": {
          hideTip();
          (event.currentTarget as HTMLElement)?.blur();
          handled = true;
          break;
        }
      }

      if (handled) {
        event.preventDefault();
        setActive({ seriesIndex, dataIndex });
        if (event.key === "Escape") {
          setAnnouncement("");
        } else {
          showTip(seriesIndex, dataIndex);
          setAnnouncement(describePoint(seriesIndex, dataIndex));
        }
      }
    },
    [describePoint, getDataLength, getSeries, hideTip, showTip],
  );

  return {
    containerProps: {
      tabIndex: 0,
      className: "gi-chart-focusable",
      role: "img" as const,
      "aria-label": ariaLabel,
      onFocus,
      onBlur,
      onKeyDown,
    },
    announcement,
  };
}
