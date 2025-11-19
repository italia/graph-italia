import React, { useRef, useState, useEffect } from "react";
import { dataToCSV, downloadPng, downloadCSV } from "../../lib/downloadUtils";
import DataTable from "../dataTable/DataTable";
import { FieldDataType, InfosType } from "../../types";
import type { EChartsType } from "echarts";
import RenderChart from "../RenderChart";
import "./chartWrapper.css";
import {
  cleanupInfoText,
  computePanelHeights,
  createMarkdownRenderer,
  formatUpdatedAt,
  observeElementHeight,
} from "./utils";

export type ChartWrapperProps = {
  id?: string;
  data: FieldDataType;
  info: InfosType;
  spritePath?: string;
  hFactor?: number;
  rowHeight?: number;
  enableDownloadImage?: boolean;
  enableDownloadData?: boolean;
  shareFunction?: (id: string) => void;
};

export default function ChartWrapper(props: ChartWrapperProps) {
  const {
    data,
    info,
    hFactor = 1,
    rowHeight,
    enableDownloadData = true,
    enableDownloadImage = true,
    spritePath = "/sprites.svg",
  } = props;

  let { id = (Math.random() + 1).toString(36).substring(7) } = props;
  if (data.id) {
    id = data.id;
  }

  const {
    labelDownloadData = "Download Data",
    labelDownloadImage = "Download Pic",
    labelShare = "Condividi",
    labelSource = "Sorgente Dati",
    labelUpdated = "Aggiornato al",

    labelTabInfo = "Info",
    labelTabChart = "Grafico",
    labelTabData = "Tabella dati",
    text = "",
    sourceTextInfo = "",
    title = data.name || "",
    subTitle = data.description || "",
    chartFooterText = "",
  } = info;

  const tabs = [labelTabChart, labelTabData, labelTabInfo];
  const { config } = data;
  const [echartInstance, setEchartInstance] = useState<EChartsType | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<number>(0);

  const csvData = dataToCSV(data.data);

  const formattedUpdatedAt = formatUpdatedAt(data.updatedAt);
  const infoClean = cleanupInfoText(text);
  const { panelHeightNum, panelHeight } = computePanelHeights(
    rowHeight,
    hFactor,
    config.h,
    600
  );
  const MarkdownRenderer = createMarkdownRenderer(labelSource);
  const footerRef = useRef<HTMLDivElement | null>(null);
  const [chartAreaRowHeight, setChartAreaRowHeight] = useState<number>(400);
  const wrapRef = useRef(null);

  useEffect(() => {
    return observeElementHeight(
      () => wrapRef.current as unknown as HTMLElement | null,
      setChartAreaRowHeight
    );
  }, [panelHeightNum, activeTab, chartFooterText]);

  return (
    <div
      className="cw-container"
      style={{
        backgroundColor: data.config.background || "#F2F7FC",
      }}
    >
      {title && <h3 className="cw-title">{title}</h3>}
      {subTitle && (
        <p
          className="cw-subtitle"
          dangerouslySetInnerHTML={{ __html: `${subTitle}` }}
        />
      )}

      <div className="cw-tabs">
        <ul className="cw-tablist" role="tablist" aria-label={`tablist-${id}`}>
          {tabs.map((name, i) => {
            const tabId = `tab${i + 1}-${id}`;
            return (
              <li key={`${id}-tab_${i}`}>
                <button
                  id={tabId}
                  role="tab"
                  type="button"
                  className="cw-tab"
                  aria-controls={`${tabId}-content`}
                  aria-selected={activeTab === i}
                  onMouseDown={(e) => {
                    e.preventDefault();
                  }}
                  onClick={() => setActiveTab(i)}
                >
                  {name}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Tab panels */}
        <div className="cw-panels" style={{ height: panelHeight }}>
          <div
            id={`tab1-${id}-content`}
            role="tabpanel"
            aria-labelledby={`tab1-${id}`}
            aria-hidden={activeTab !== 0}
            className={`cw-tabpanel ${activeTab === 0 ? "is-active" : ""}`}
          >
            <div key={id} className="cw-chart" ref={wrapRef}>
              <RenderChart
                id={id}
                {...data}
                hFactor={hFactor}
                rowHeight={chartAreaRowHeight}
                getInstance={setEchartInstance}
              />
            </div>
            {chartFooterText && (
              <div className="cw-footer" ref={footerRef}>
                <MarkdownRenderer>{chartFooterText}</MarkdownRenderer>
              </div>
            )}
          </div>

          <div
            id={`tab2-${id}-content`}
            role="tabpanel"
            aria-labelledby={`tab2-${id}`}
            aria-hidden={activeTab !== 1}
            className={`cw-tabpanel ${activeTab === 1 ? "is-active" : ""}`}
          >
            <DataTable id={id} data={data.data as any[]} />
          </div>

          <div
            id={`tab3-${id}-content`}
            role="tabpanel"
            aria-labelledby={`tab3-${id}`}
            aria-hidden={activeTab !== 2}
            className={`cw-tabpanel ${activeTab === 2 ? "is-active" : ""}`}
          >
            <div>
              {info && <MarkdownRenderer>{infoClean}</MarkdownRenderer>}
              {formattedUpdatedAt && (
                <div className="cw-meta">
                  {labelUpdated || "Dati aggiornati al"}{" "}
                  <span style={{ fontWeight: 600 }}>{formattedUpdatedAt}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="cw-bottom">
        {sourceTextInfo && (
          <div className="cw-source">
            <span className="cw-source-label">
              {labelSource || "Fonte dati"}:
            </span>
            <span className="cw-source-content">
              <MarkdownRenderer>{sourceTextInfo}</MarkdownRenderer>
            </span>
          </div>
        )}

        <div className="cw-actions">
          {enableDownloadData && (
            <button
              type="button"
              className="cw-btn cw-btn--primary"
              title={labelDownloadData || "Download CSV"}
              aria-label={labelDownloadData || "Download CSV"}
              onClick={() => downloadCSV(csvData, "" + id)}
            >
              {labelDownloadData || "Download"} CSV
              <svg
                className="cw-icon"
                focusable="false"
                aria-hidden="true"
                role="img"
              >
                <use href={`${spritePath}#it-download`}></use>
              </svg>
            </button>
          )}

          {enableDownloadImage && (
            <button
              type="button"
              className="cw-btn cw-btn--primary"
              title={labelDownloadImage || "Download PNG"}
              aria-label={labelDownloadImage || "Download PNG"}
              onClick={() => downloadPng(echartInstance, "" + id)}
            >
              {labelDownloadImage || "Download Png"}
              <svg
                className="cw-icon"
                focusable="false"
                aria-hidden="true"
                role="img"
              >
                <use href={`${spritePath}#it-download`}></use>
              </svg>
            </button>
          )}

          {props.shareFunction && (
            <button
              type="button"
              className="cw-btn cw-btn--secondary"
              id={"share-link" + id}
              aria-label={labelShare || "Condividi"}
              title={labelShare || "Condividi"}
              onClick={() =>
                props.shareFunction && props.shareFunction("share-link" + id)
              }
            >
              {labelShare || "Condividi"}
              <svg
                className="cw-icon"
                focusable="false"
                aria-hidden="true"
                role="img"
              >
                <use href={`${spritePath}#it-share`}></use>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
