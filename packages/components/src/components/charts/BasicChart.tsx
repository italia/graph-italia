import { useRef, useEffect, useState } from "react";
import ReactEcharts, { type EChartsOption } from "echarts-for-react";
import type { EChartsType } from "echarts";
import type { ChartPropsType, FieldDataType } from "../../types";
import { formatTooltip } from "../../lib/utils";
import { useResolvedTheme } from "../../context/ColorSchemeContext";
import { useChartKeyboard } from "../../lib/useChartKeyboard";
import React from "react";

function BasicChart({
  data,
  setEchartInstance,
  rowHeight,
  isMobile = false,
  hFactor = 1,
}: ChartPropsType) {
  const resolvedTheme = useResolvedTheme();
  const refCanvas = useRef<ReactEcharts>(null);
  const [loaded, setLoaded] = useState(false);
  const [localInstance, setLocalInstance] = useState<EChartsType | null>(null);
  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 1000);
  }, []);
  useEffect(() => {
    if (loaded && refCanvas.current) {
      try {
        const echartInstance = refCanvas.current.getEchartsInstance();
        setLocalInstance(echartInstance);
        if (setEchartInstance) {
          setEchartInstance(echartInstance);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [loaded, refCanvas.current]);
  function getOptions(data: FieldDataType) {

    if (!data || !data.config) {
      return <div>No config found</div>;
    }

    const config: any = data.config;

    const responsive: boolean =
      typeof config.responsive === "undefined" ? true : config.responsive;
    let grid = {
      left: isMobile && responsive ? 10 : config.gridLeft || "10%",
      right: config.gridRight || "10%",
      height: config.gridHeight || "auto",
      width: config.gridWidth || "auto",
      bottom: config.gridBottom || 60,
      top: config.gridTop || 60,
    };
    const zoom = config.zoom || "none";
    let dataZoom: any = [];
    if (zoom !== "none") {
      const x = [
        {
          show: true,
          start: 1,
          end: 100,
          xAxisIndex: [0],
          type: "inside",
        },
        {
          show: true,
          start: 1,
          end: 100,
          xAxisIndex: [0],
          type: "slider",
        },
      ];
      const y = [
        {
          show: true,
          start: 1,
          end: 100,
          yAxisIndex: [0],
          type: "inside",
        },
        {
          show: true,
          start: 1,
          end: 100,
          yAxisIndex: [0],
          type: "slider",
        },
      ];

      if (zoom === "both_axis") {
        dataZoom = [...x, ...y];
      } else if (zoom === "x_axis") {
        dataZoom = [...x];
      } else if (zoom === "y_axis") {
        dataZoom = [...y];
      }
    }

    let dataZoomOpt = ["both_axis", "x_axis", "y_axis"].includes(zoom)
      ? { dataZoom }
      : {};

    let xName = config.xLabel
      ? {
        name: config.xLabel,
        nameLocation: "middle",
        nameGap: config.nameGap,
      }
      : {};
    let yName = config.yLabel
      ? {
        name: config.yLabel,
        nameLocation: "middle",
        nameGap: config.nameGap,
      }
      : {};

    // Log axis cannot represent zero/negative values: ECharts skips them
    const valueAxisType = config.logScale ? "log" : "value";

    const axis =
      config.direction === "vertical"
        ? {
          xAxis: {
            ...xName,
            type: "category",
            data: data.dataSource?.categories,
            axisTick: { show: false },
            axisLabel: {
              hideOverlap: true,
            },
          },
          yAxis: {
            ...yName,
            nameRotate: 90,
            type: valueAxisType,
            axisTick: { show: false },
            axisLabel: { show: responsive ? !isMobile : true },
          },
        }
        : {
          yAxis: {
            ...xName,
            nameRotate: 90,
            type: "category",
            data: data.dataSource?.categories,
            axisTick: { show: false },
            axisLabel: { show: responsive ? !isMobile : true },
          },
          xAxis: {
            ...yName,
            type: valueAxisType,
            axisTick: { show: false },
            axisLabel: {
              hideOverlap: true,
            },
          },
        };

    const tooltip = {
      trigger: config.tooltipTrigger || "item",
      confine: true,
      extraCssText: "z-index:1000;max-width:90%;white-space:pre-wrap;",
      textStyle: {
        overflow: "breakAll",
        width: 150,
      },
      axisPointer: {
        type: "shadow",
        snap: true,
      },
      valueFormatter: (value: any) => {
        return formatTooltip(value, config);
      },
      show: config.tooltip ?? true,
    };

    const colorOpt = config.colors?.length ? { color: config.colors } : {};

    const aria = {
      enabled: true,
      decal: { show: true },
      label: { enabled: true, description: config.title || config.description || "" },
    };

    let options = {
      ...colorOpt,
      ...axis,
      grid,
      aria,
      series: data.dataSource?.series?.map((serie: any) => {
        let rest = {};
        // Stacking on a log axis produces wrong values, so log scale wins
        if (serie.type === "bar" && config.stack && !config.logScale) {
          let stack: any = config.stack
            ? config.direction === "vertical"
              ? "x"
              : "y"
            : false;

          rest = {
            ...rest,
            stack,
            itemStyle: { borderColor: "white", borderWidth: 0.25 },
          };
        }
        if (serie.type === "line") {
          if (config.smooth) {
            let smooth: any = config.smooth ? parseFloat(config.smooth) : false;
            rest = { ...rest, smooth };
          }
          if (config.showArea) {
            const area = { areaStyle: {} };
            rest = { ...rest, ...area };
          }
          if (config.showAllSymbol) {
            const symbols = { showAllSymbol: true || "auto" };
            rest = { ...rest, ...symbols };
          }
        }
        return {
          ...serie,
          ...rest,
        };
      }),
      textStyle: {
        fontFamily: "Titillium Web",
        fontSize: 14,
      },
      tooltip,
      legend: {
        type: "scroll",
        left: "center",
        top: config?.legendPosition || "bottom",
        show: config.legend ?? true,
      },
      ...dataZoomOpt,
    };
    return options;
  }

  const config: any = data.config || null;
  const height = (config?.h || 500) * hFactor;
  const seriesCount = data.dataSource?.series?.length ?? 0;
  const ariaLabel = `${config?.title || "Grafico"}. ${seriesCount > 0 ? `${seriesCount} serie. ` : ""}Usa le frecce per esplorare i dati, Esc per uscire.`;
  const keyboardProps = useChartKeyboard(localInstance, ariaLabel);
  return (
    <div style={{ textAlign: "left" }} {...keyboardProps}>
      <ReactEcharts
        option={getOptions(data) as EChartsOption}
        theme={resolvedTheme}
        ref={refCanvas as any}
        style={{
          width: "100%",
          height: rowHeight ? "100%" : `${height}px`,
          minHeight: rowHeight ? rowHeight : "auto",
          maxHeight: "100%",
          maxWidth: "100%",
        }}
      />
    </div>
  );
}

export default BasicChart;
