import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useResolvedTheme } from "../../context/ColorSchemeContext";
import type { FieldDataType } from "../../types";
import "./text.css";

/**
 * Headings shifted two levels down: in a dashboard the page has its h1 and
 * the dashboard name is an h2, so "# Title" in a text block becomes an h3.
 */
const HEADING_SHIFT = {
  h1: "h3",
  h2: "h4",
  h3: "h5",
  h4: "h6",
  h5: "h6",
  h6: "h6",
} as const;

/**
 * Markdown text block: the "text" chart type (config.content), used for the
 * texts of a dashboard. It has no data, so it is never shown in ChartWrapper.
 */
export default function TextBlock({
  data,
  hFactor = 1,
  rowHeight,
}: {
  data: FieldDataType;
  hFactor?: number;
  rowHeight?: number;
}) {
  const resolvedTheme = useResolvedTheme();
  const style: React.CSSProperties = rowHeight
    ? { maxHeight: rowHeight * hFactor, overflowY: "auto" }
    : {};

  return (
    <div id={data.id} className={`${resolvedTheme} dv-text-block`} style={style}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={HEADING_SHIFT}>
        {data.config?.content ?? ""}
      </ReactMarkdown>
    </div>
  );
}
