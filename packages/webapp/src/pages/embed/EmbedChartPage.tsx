import { useEffect, useState } from "react";
import { RenderChart, ColorSchemeProvider } from "dataviz-components";
import { useParams, useSearchParams } from "react-router-dom";

import * as api from "../../lib/api";
import useSWR from "swr";
import Loading from "../../components/layout/Loading";

function EmbedChartPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { data, error, isLoading } = useSWR(`${id}`, api.showChart);

  const [browserScheme, setBrowserScheme] = useState<"light" | "dark">(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setBrowserScheme(e.matches ? "dark" : "light");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const themeParam = searchParams.get("theme");
  const resolvedScheme: "light" | "dark" =
    themeParam === "dark" || themeParam === "light" ? themeParam : browserScheme;

  return (
    <ColorSchemeProvider scheme={resolvedScheme}>
      <div className=''>
        {isLoading && <Loading />}
        {error && <div className='text-error'>{error}</div>}
        {data && <RenderChart {...(data as any)} />}
      </div>
    </ColorSchemeProvider>
  );
}

export default EmbedChartPage;
