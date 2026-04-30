import type { EChartsType } from "echarts";
import React, { useEffect, useRef, useState } from "react";
import { getBasicValues, getMapValues, getPieValues } from "../lib/utils";
import "../themes";
import type { FieldDataType } from "../types";
import BasicChart from "./charts/BasicChart";
import GeoMapChart from "./charts/GeoMapChart";
import PieChart from "./charts/PieChart";
import KpiGroup from "./kpi/KpiGroup";
import ClusterMap from "./maps/ClusterMap";
import PoweredBy from "./PoweredBy";

type RenderProps = FieldDataType & {
  rowHeight?: number;
  hFactor?: number;
  getPicture?: (dataUrl: string) => void;
  getInstance?: (instance: EChartsType) => void;
  poweredByLabel?: string;
};
function RenderChart(props: RenderProps) {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [props.config]);

  const { rowHeight, hFactor = 1, poweredByLabel } = props;
  const wrapRef = useRef(null);
  const [echartInstance, setEchartInstance] = useState<EChartsType | null>(
    null,
  );
  const [width, setWidth] = useState<number>(500);
  const isMobile = width <= 480 ? true : false;

  /** Get Image */
  useEffect(() => {
    if (echartInstance && (props.getPicture || props.getInstance)) {
      if (props.getInstance) {
        props.getInstance(echartInstance);
      } else if (props.getPicture) {
        const dataUrl = (echartInstance! satisfies EChartsType).getDataURL();
        props.getPicture(dataUrl);
      }
    }
  }, [echartInstance]);

  /** Resize */
  function setDimension() {
    const element: any = wrapRef.current;
    if (!element) return;
    let w: number = 500;
    try {
      w = element.clientWidth || element.getBoundingClientRect().width;
    } catch (error) { }
    if (w) setWidth(w);
  }

  useEffect(() => {
    window.addEventListener("resize", setDimension);
    setDimension();
    return () => {
      window.removeEventListener("resize", setDimension);
    };
  }, [wrapRef]);

  /** Loading */
  if (loading) return null;

  // const showMinHeight = props.chart !== "kpi" && props.chart !== "kpiGroup";
  // const height = props.config?.h || showMinHeight ? 500 : 100;
  // const minHeight = rowHeight ? rowHeight : height;

  const baseStyle = {
    width: "100%",
    maxHeight: "100%",
    height: "auto",
  };
  const chartWrapStyle = {
    ...baseStyle,
    minHeight: 0,
  }
  // if (showMinHeight) {
  //   chartWrapStyle = {
  //     ...chartWrapStyle,
  //     minHeight: minHeight,
  //   }
  // };

  /** Render  */
  return (
    <div style={chartWrapStyle}>
      <div ref={wrapRef}>
        {props && (
          <>
            {(props.chart === "bar" || props.chart === "line") && (
              <BasicChart
                id={props.id}
                data={getBasicValues(props)}
                isMobile={isMobile}
                setEchartInstance={setEchartInstance}
                rowHeight={rowHeight}
                hFactor={hFactor}
              />
            )}
            {props.chart === "pie" && (
              <PieChart
                id={props.id}
                data={getPieValues(props)}
                isMobile={isMobile}
                setEchartInstance={setEchartInstance}
                rowHeight={rowHeight}
                hFactor={hFactor}
              />
            )}
            {props.chart === "map" && (
              <GeoMapChart
                id={props.id}
                data={getMapValues(props)}
                isMobile={isMobile}
                setEchartInstance={setEchartInstance}
                rowHeight={rowHeight}
                hFactor={hFactor}
              />
            )}
            {props.chart === "cmap" && (
              <ClusterMap
                data={props}
                rowHeight={rowHeight}
                hFactor={hFactor}
              />
            )}
            {(props.chart === "kpi" || props.chart === "kpiGroup") && (
              <KpiGroup
                data={props}
                rowHeight={rowHeight}
                hFactor={hFactor}
              />
            )}
          </>
        )}
      </div>
      <PoweredBy label={poweredByLabel} />
    </div>
  );
}

export default RenderChart;
