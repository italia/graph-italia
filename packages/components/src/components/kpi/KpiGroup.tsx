import React from "react";
import type { FieldDataType, KpiItemType } from "../../types";
import Kpi from "./KpiItem";
import "./kpi.css";

const BOOTSTRAP_ITALIA_CDN =
  "https://cdn.jsdelivr.net/npm/bootstrap-italia@2.14.0/dist/css/bootstrap-italia.min.css";
const LINK_ID = "bootstrap-italia-cdn";

export default function KpiGroup({
  data,
  hFactor = 1,
  rowHeight,
}: {
  data: FieldDataType;
  hFactor: number;
  rowHeight?: number;
}) {
  React.useEffect(() => {
    // Temporary loading of Bootstrap Italia CSS from CDN
    if (!document.getElementById(LINK_ID)) {
      const link = document.createElement("link");
      link.id = LINK_ID;
      link.rel = "stylesheet";
      link.href = BOOTSTRAP_ITALIA_CDN;
      document.head.appendChild(link);
    }
  }, []);
  const { id, config } = data;
  const dataSource: KpiItemType[] = data.dataSource as KpiItemType[];
  const { direction } = config;
  const isVertical = direction === "vertical";
  const kpiGroupClass = isVertical
    ? "kpi-group-vertical"
    : "kpi-group-horizontal";

  const baseStyle = {
    maxWidth: "100%",
    maxHeight: "100%",
  };
  let divStyle = {};

  if (rowHeight) {
    divStyle = {
      ...baseStyle,
      minHeight: rowHeight * hFactor,
    };
  }
  return (
    <div
      id={id}
      className={`kpi-group ${kpiGroupClass}`}
      style={{ ...divStyle, background: data.config.background || "#F2F7FC" }}
    >
      {dataSource.map((item: KpiItemType, index: number) => (
        <div className='kpi-group-item' key={`${index}-${item.title}`}>
          <Kpi data={item} />
        </div>
      ))}
    </div>
  );
}
