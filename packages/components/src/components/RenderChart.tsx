import type { EChartsType } from "echarts";
import React, { useEffect, useRef, useState } from "react";
import { getBasicValues, getMapValues, getPieValues } from "../lib/utils";
import "../themes";
import type { FieldDataType, MatrixType } from "../types";
import BasicChart from "./charts/BasicChart";
import GeoMapChart from "./charts/GeoMapChart";
import PieChart from "./charts/PieChart";
import KpiGroup from "./kpi/KpiGroup";
import ClusterMap from "./maps/ClusterMap";

type RenderProps = FieldDataType & {
  rowHeight?: number;
  hFactor?: number;
  getPicture?: (dataUrl: string) => void;
  getInstance?: (instance: EChartsType) => void;
  /** Caption of the screen-reader-only data table. Defaults to Italian. */
  dataTableCaption?: string;
};

const visuallyHidden: React.CSSProperties = {
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

function isMatrix(d: unknown): d is MatrixType {
  return Array.isArray(d) && d.length > 1 && Array.isArray(d[0]);
}
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

  const altText = [props.name, props.description].filter(Boolean).join(". ");

  // A wrapper with role="img" would hide the whole subtree from assistive
  // tech, including the focusable chart (which exposes its own accessible
  // name and keyboard hints) and the data table below (WCAG 1.1.1). It stays
  // only for the cluster map, which has no accessible alternative of its own.
  const wrapA11yProps =
    props.chart === "cmap"
      ? { role: "img" as const, "aria-label": altText || undefined }
      : {};

  // Underlying data, exposed to screen readers as a real table: the canvas
  // chart is otherwise an empty image for them.
  const showDataTable =
    isMatrix(props.data) &&
    props.chart !== "kpi" &&
    props.chart !== "kpiGroup" &&
    props.chart !== "cmap";
  const [headerRow, ...bodyRows] = showDataTable
    ? (props.data as MatrixType)
    : [[]];
  const captionLabel = props.dataTableCaption || "Dati del grafico";
  const caption = props.name ? `${captionLabel}: ${props.name}` : captionLabel;

  /** Render  */
  return (
    <div style={chartWrapStyle}>
      <div ref={wrapRef} {...wrapA11yProps}>
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
      {showDataTable && (
        <div style={visuallyHidden}>
          <table>
            <caption>{caption}</caption>
            <thead>
              <tr>
                {headerRow.map((cell, i) => (
                  <th key={i} scope="col">
                    {cell === "_" ? "" : cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bodyRows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) =>
                    j === 0 ? (
                      <th key={j} scope="row">
                        {cell}
                      </th>
                    ) : (
                      <td key={j}>{cell}</td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RenderChart;
