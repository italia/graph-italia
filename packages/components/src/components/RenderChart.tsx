import React from "react";
import BasicChart from "./charts/BasicChart";
import PieChart from "./charts/PieChart";
import GeoMapChart from "./charts/GeoMapChart";
import { getPieValues, getBasicValues, getMapValues } from "../lib/utils";
import { useEffect, useState, useRef } from "react";
import ClusterMap from "./maps/ClusterMap";
import KpiGroup from "./kpi/KpiGroup";
import type { EChartsType } from "echarts";
import type { FieldDataType } from "../types";

type RenderProps = FieldDataType & {
  rowHeight?: number;
  hFactor?: number;
  getPicture?: (dataUrl: string) => void;
  getInstance?: (instance: EChartsType) => void;
};
function RenderChart(props: RenderProps) {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [props.config]);

  const { rowHeight, hFactor = 1 } = props;
  const wrapRef = useRef(null);
  const [echartInstance, setEchartInstance] = useState<EChartsType | null>(
    null
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
    } catch (error) {}
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

  /** Default style */
  const baseStyle = {
    width: "100%",
    height: "100%",
    maxHeight: "100%",
  };
  let chartWrapStyle = {
    ...baseStyle,
    minHeight: rowHeight ? rowHeight : props.config.h,
  };

  /** Render  */
  return (
    <div style={baseStyle}>
      <div
        className={`w-full min-height-[${
          rowHeight ? rowHeight + "px" : props.config.h + "px"
        }] h-full max-height-full p-4`}
        style={chartWrapStyle}
      >
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
              {props.chart === "kpi" && (
                <KpiGroup
                  data={props}
                  rowHeight={rowHeight}
                  hFactor={hFactor}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default RenderChart;
