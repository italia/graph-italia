import React from "react";
import type { FieldDataType, KpiItemType } from "../../types";
import { useResolvedTheme } from "../../context/ColorSchemeContext";
import Kpi from "./KpiItem";
import "./kpi.css";

export default function KpiGroup({
  data,
  hFactor = 1,
  rowHeight,
}: {
  data: FieldDataType;
  hFactor: number;
  rowHeight?: number;
}) {
  const { id, config } = data;
  const dataSource: KpiItemType[] = data.dataSource as KpiItemType[] || data.data as any[] || [];
  const { direction } = config;
  const isVertical = direction === "vertical";
  const kpiGroupClass = isVertical
    ? "dv-kpi-group-vertical"
    : "dv-kpi-group-horizontal";

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

  const resolvedTheme = useResolvedTheme();
  // const background = data.config.background || "#F2F7FC";

  return (
    <div
      id={id}
      className={`${resolvedTheme} dv-kpi-group ${kpiGroupClass}`}
      style={{ ...divStyle, backgroundColor: "transparent" }}
    >
      {dataSource.map((item: KpiItemType, index: number) => (
        <div className={`${resolvedTheme} dv-kpi-group-item`} key={`${index}-${item.title}`}>
          <Kpi data={item} />
        </div>
      ))}
    </div>
  );
}
