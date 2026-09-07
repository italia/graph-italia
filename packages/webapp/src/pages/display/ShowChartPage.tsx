import { ColorSchemeProvider, RenderChart } from "graph-italia-components";
import type { EChartsType } from "echarts";
import { useState } from "react";
import toast from "react-hot-toast";
import { downloadChartPng, downloadChartSvg } from "../../lib/chartExport";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import useSWR from "swr";
import Layout from "../../components/layout";
import Loading from "../../components/layout/Loading";
import * as api from "../../lib/api";
import { useSettingsStore } from "../../lib/store/settings_store";
import { publicChartErrorMessage } from "../embed/EmbedChartPage";
import { useChartA11yProps } from "../../hooks/useChartA11yProps";

function ShowChartPage() {
  const { id } = useParams();
  const previewMode = !api.isPublishingEnabled();
  const { t } = useTranslation("pages");
  const chartA11y = useChartA11yProps();
  const { data, error, isLoading } = useSWR(
    `${id}`,
    previewMode ? api.getChart : api.showChart,
  );
  const { settings } = useSettingsStore();
  const scheme = settings?.preferredTheme ?? "light";
  const [instance, setInstance] = useState<EChartsType | null>(null);
  const chart = data as
    | (React.ComponentProps<typeof RenderChart> & {
        name?: string;
        description?: string;
      })
    | undefined;
  return (
    <Layout>
      {/* Aligned to the header gutters; min-height fills the space between
          header and footer so the chart sits vertically centered */}
      <div className="px-4 lg:px-10 py-10 min-h-[calc(100dvh-230px)] flex flex-col justify-center">
        {previewMode && (
          <div role="status" className="alert alert-info mb-4">
            <span>{t("publicChart.previewNotice")}</span>
          </div>
        )}
        {isLoading && <Loading />}
        {error && (
          <div role="alert" className="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{publicChartErrorMessage(error, t)}</span>
          </div>
        )}
        {chart && (
          <>
            <Helmet>
              <title>
                {chart.name ? `${chart.name}: Graph Italia` : "Graph Italia"}
              </title>
            </Helmet>
            {chart.name && (
              <h1 className="text-2xl font-bold mb-1">{chart.name}</h1>
            )}
            {chart.description && (chart.config as { showDescription?: boolean } | undefined)?.showDescription !== false && (
              <p className="text-base-content/70 mb-4">{chart.description}</p>
            )}
            <ColorSchemeProvider scheme={scheme}>
              <RenderChart {...chart} {...chartA11y} getInstance={setInstance} />
            </ColorSchemeProvider>
            {/* Export as image or vector, for documents and presentations (#79) */}
            {instance && (
              <div
                role="group"
                aria-label={t("publicChart.download.label")}
                className="mt-4 flex flex-wrap gap-2"
              >
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    try {
                      downloadChartPng(instance, chart.name ?? "");
                    } catch {
                      toast.error(t("publicChart.download.error"));
                    }
                  }}
                >
                  {t("publicChart.download.png")}
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    try {
                      downloadChartSvg(instance, chart.name ?? "");
                    } catch {
                      toast.error(t("publicChart.download.error"));
                    }
                  }}
                >
                  {t("publicChart.download.svg")}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

export default ShowChartPage;
