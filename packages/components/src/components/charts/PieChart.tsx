import ReactEcharts, { type EChartsOption } from "echarts-for-react";
import React, { useEffect, useRef, useState } from "react";
import { formatTooltip } from "../../lib/utils";
import type { ChartPropsType, FieldDataType } from "../../types";
import { useResolvedTheme } from "../../context/ColorSchemeContext";

function PieChart({
  id,
  data,
  setEchartInstance,
  isMobile = false,
  rowHeight,
  hFactor = 1,
}: ChartPropsType) {
  const resolvedTheme = useResolvedTheme();
  const refCanvas = useRef<ReactEcharts>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 1000);
  }, []);
  useEffect(() => {
    if (loaded && refCanvas.current) {
      try {
        const echartInstance = refCanvas.current.getEchartsInstance();
        if (setEchartInstance) {
          setEchartInstance(echartInstance);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [loaded, refCanvas.current]);

  function getTotal(data: any) {
    return data.reduce((acc: number, v: any) => {
      return acc + Number(v.value);
    }, 0);
  }

  function getOptions(data: FieldDataType) {
    const { dataSource } = data;
    const config = data.config;

    const tooltip = {
      trigger: "item",
      confine: true,
      extraCssText: "z-index:1000;max-width:80%;white-space:pre-wrap;",
      textStyle: {
        overflow: "breakAll",
        width: 150,
      },
      valueFormatter: (value: any) => {
        return formatTooltip(value, config);
      },
      show: config.tooltip,
    };
    let total = "";
    try {
      const serie = dataSource.series;
      let serieData;
      if (typeof serie === "object" && !Array.isArray(serie)) {
        serieData = serie.data;
      } else if (Array.isArray(serie)) {
        serieData = serie[0].data;
      }
      const totale = getTotal(serieData);
      total = formatTooltip(totale, config);
    } catch (error) {}

    const showLabels = config.showPieLabels === false ? false : true;
    const colorOpt = config.colors?.length ? { color: config.colors } : {};

    let options = {
      title: {
        text: `${config?.totalLabel || "Totale"}\n${total ? total : "0"}`,
        left: "center",
        top: "50%",
        textVerticalAlign: "middle",
        textStyle: {
          fontFamily: "Titillium Web",
          fontWeight: "600",
          fontSize: 16,
        },
      },
      ...colorOpt,
      series: {
        ...dataSource.series,
        labelLine: {
          show: showLabels && config.labeLine,
        },
        label: {
          show: showLabels,
          position: config.labeLine ? "outside" : "inside",
        },
      },
      textStyle: {
        fontFamily: "Titillium Web",
        fontSize: 12,
      },
      tooltip,
      legend: {
        type: "scroll",
        left: "center",
        top: config?.legendPosition || "bottom",
        show: config.legend ?? true,
      },
    };
    return options;
  }

  if (!data) return <div>...</div>;
  let h = (data.config?.h || 350) * hFactor;
  const responsive =
    typeof data.config?.responsive === "undefined"
      ? true
      : data.config.responsive;
  const chartHeight = responsive && isMobile ? (h / 100) * 80 : h;
  const height = rowHeight ? "100%" : `${chartHeight}px`;
  const minHeight = rowHeight ? rowHeight : "auto";
  return (
    <div key={id} id={"chart_" + id}>
      <ReactEcharts
        option={getOptions(data) as EChartsOption}
        theme={resolvedTheme}
        ref={refCanvas}
        style={{
          height,
          minHeight,
          maxHeight: "100%",
          width: "100%",
          maxWidth: "100%",
        }}
      />
    </div>
  );
}

export default PieChart;
