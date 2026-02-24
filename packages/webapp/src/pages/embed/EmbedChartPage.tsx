import { useParams, useSearchParams } from "react-router-dom";
import { RenderChart, ColorSchemeProvider } from "dataviz-components";

import * as api from "../../lib/api";
import useSWR from "swr";
import Loading from "../../components/layout/Loading";

function EmbedChartPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { data, error, isLoading } = useSWR(`${id}`, api.showChart);

  const themeParam = searchParams.get("theme");
  const scheme: "light" | "dark" | undefined =
    themeParam === "dark" || themeParam === "light" ? themeParam : undefined;

  return (
    <ColorSchemeProvider scheme={scheme}>
      <div className=''>
        {isLoading && <Loading />}
        {error && <div className='text-error'>{error}</div>}
        {data && <RenderChart {...(data as any)} />}
      </div>
    </ColorSchemeProvider>
  );
}

export default EmbedChartPage;
