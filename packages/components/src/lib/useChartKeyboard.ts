import { useCallback, useEffect, useRef, useState } from "react";
import type { EChartsType } from "echarts";

/**
 * Adds keyboard accessibility and focusable behavior on top of an ECharts
 * instance:
 *  - the chart container becomes focusable (tabIndex 0, role img)
 *  - on focus the tooltip is shown for the first data point of the first
 *    series, so the same information visible on mouse hover is also
 *    available with the keyboard (WCAG 2.1.1, 1.4.13)
 *  - ArrowLeft/ArrowRight cycle data points, ArrowUp/ArrowDown cycle series
 *  - on blur the tooltip is hidden
 *
 * The hook returns the props that should be spread on the container wrapping
 * the chart canvas.
 */
export function useChartKeyboard(
  echartInstance: EChartsType | null,
  ariaLabel: string,
) {
  const [active, setActive] = useState<{ seriesIndex: number; dataIndex: number }>(
    { seriesIndex: 0, dataIndex: 0 },
  );
  const activeRef = useRef(active);
  activeRef.current = active;

  const showTip = useCallback(
    (seriesIndex: number, dataIndex: number) => {
      if (!echartInstance) return;
      try {
        echartInstance.dispatchAction({
          type: "showTip",
          seriesIndex,
          dataIndex,
        });
      } catch {
        /* echarts may not be ready yet */
      }
    },
    [echartInstance],
  );

  const hideTip = useCallback(() => {
    if (!echartInstance) return;
    try {
      echartInstance.dispatchAction({ type: "hideTip" });
    } catch {
      /* noop */
    }
  }, [echartInstance]);

  const getSeries = useCallback((): any[] => {
    if (!echartInstance) return [];
    const option = echartInstance.getOption() as { series?: any[] } | undefined;
    return option?.series ?? [];
  }, [echartInstance]);

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

  const onFocus = useCallback(() => {
    showTip(activeRef.current.seriesIndex, activeRef.current.dataIndex);
  }, [showTip]);

  const onBlur = useCallback(() => {
    hideTip();
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
        showTip(seriesIndex, dataIndex);
      }
    },
    [getDataLength, getSeries, hideTip, showTip],
  );

  return {
    tabIndex: 0,
    role: "img" as const,
    "aria-label": ariaLabel,
    onFocus,
    onBlur,
    onKeyDown,
  };
}
