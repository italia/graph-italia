import { ColorSchemeProvider, RenderChart } from "graph-italia-components";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import Layout from "../../components/layout";
import Loading from "../../components/layout/Loading";
import * as api from "../../lib/api";
import { useSettingsStore } from "../../lib/store/settings_store";

function ShowChartPage() {
  const { id } = useParams();
  const previewMode = !api.isPublishingEnabled();
  const { data, error, isLoading } = useSWR(
    `${id}`,
    previewMode ? api.getChart : api.showChart,
  );
  const { settings } = useSettingsStore();
  const scheme = settings?.preferredTheme ?? "light";
  return (
    <Layout>
      {/* Aligned to the header gutters; min-height fills the space between
          header and footer so the chart sits vertically centered */}
      <div className="px-4 lg:px-10 py-10 min-h-[calc(100dvh-230px)] flex flex-col justify-center">
        {previewMode && (
          <div role="status" className="alert alert-info mb-4">
            <span>
              Public publishing is disabled on this instance — you're viewing an
              authenticated preview, not a public page.
            </span>
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
            <span>{error.message}</span>
          </div>
        )}
        {data && (
          <ColorSchemeProvider scheme={scheme}>
            <RenderChart
              {...(data as React.ComponentProps<typeof RenderChart>)}
            />
          </ColorSchemeProvider>
        )}
      </div>
    </Layout>
  );
}

export default ShowChartPage;
