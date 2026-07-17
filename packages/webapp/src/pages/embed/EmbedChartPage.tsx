import { useEffect, useState } from "react";
import { RenderChart, ColorSchemeProvider } from "graph-italia-components";
import { useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import * as api from "../../lib/api";
import useSWR from "swr";
import Loading from "../../components/layout/Loading";

/** Friendly message for a failed public chart load (401 private, 404 gone, rest generic). */
export function publicChartErrorMessage(
  error: unknown,
  t: (key: string, options: { defaultValue: string }) => string,
) {
  const status = (error as { response?: { status?: number } })?.response?.status;
  if (status === 401)
    return t("publicChart.errors.private", {
      defaultValue:
        "Questo grafico non è pubblico: chi lo ha creato non lo ha ancora pubblicato.",
    });
  if (status === 404)
    return t("publicChart.errors.notFound", {
      defaultValue: "Questo grafico non esiste o è stato eliminato.",
    });
  return t("publicChart.errors.generic", {
    defaultValue:
      "Impossibile caricare il grafico: riprova più tardi.",
  });
}

function EmbedChartPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation("pages");
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
        {error && (
          <div role="alert" className="p-4 text-center text-base-content/70">
            {publicChartErrorMessage(error, t)}
          </div>
        )}
        {data && <RenderChart {...(data as any)} />}
      </div>
    </ColorSchemeProvider>
  );
}

export default EmbedChartPage;
