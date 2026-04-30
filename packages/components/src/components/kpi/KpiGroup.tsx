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
  const { direction, background } = config;
  const isVertical = direction === "vertical";
  const kpiGroupClass = isVertical
    ? "dv-kpi-group-vertical"
    : "dv-kpi-group-horizontal";

  const baseStyle: React.CSSProperties = {
    maxWidth: "100%",
    maxHeight: "100%",
  };

  if (rowHeight) {
    baseStyle.minHeight = rowHeight * hFactor;
  }

  // When accent background is set at group level, propagate to items
  const items: KpiItemType[] = background === "accent"
    ? dataSource.map((item) => ({
        ...item,
        background_color: item.background_color || "accent",
      }))
    : dataSource;

  const resolvedTheme = useResolvedTheme();

  return (
    <div
      id={id}
      className={`${resolvedTheme} dv-kpi-group ${kpiGroupClass}`}
      style={baseStyle}
      role="list"
      aria-label="Gruppo di KPI"
    >
      {items.map((item: KpiItemType, index: number) => (
        <div
          className={`${resolvedTheme} dv-kpi-group-item`}
          key={`${index}-${item.title}`}
          role="listitem"
        >
          <Kpi data={item} poweredByLabel="" />
        </div>
      ))}
    </div>
  );
}
