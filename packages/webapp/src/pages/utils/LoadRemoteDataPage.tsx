import Papa from "papaparse";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "../../lib/toast";
import DataMngTable from "../../components/DataMngTable";
import Layout from "../../components/layout";
import NewTabLink from "../../components/layout/NewTabLink";
import LoadSource from "../../components/load-data/LoadRemoteCSVSource";
import examples from "../../data/examples.json";
import { dataToCSV, downloadCSV } from "../../lib/downloadUtils";
import useStoreState from "../../lib/store/storeState";

/**
 * Sample datasets page (menu "Dataset di esempio").
 *
 * The usability tests (#60, #61, #62) showed three misunderstandings: the
 * section was read as a gallery of ready-made charts, picking a dataset was
 * read as loading it into a chart, and the two blocks (loader form and
 * examples) looked unrelated. The page now says what the datasets are, puts
 * the datasets first, and makes the preview an explicit, named consequence of
 * "Visualizza dati"; "Copia URL" is the bridge to the chart editor.
 */
function LoadRemoteDataPage() {
  const { t } = useTranslation("pages", {
    keyPrefix: "utility.loadRemoteDataPage",
  });
  const { rawData, setRawData } = useStoreState((state) => state);
  const previewRef = useRef<HTMLElement>(null);
  const [selectedUrl, setSelectedUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleChangeData(d: any) {
    const matrix = d?.data ?? d;
    setRawData(matrix);
  }

  async function viewExample(example: { title: string; dataUrls: { csv?: string } }) {
    const url = example.dataUrls.csv;
    if (!url) return;
    setSelectedUrl(url);
    setRawData(null);
    setLoading(true);
    setStatus(t("preview.loading"));
    previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    try {
      const text = await fetch(url).then((r) => r.text());
      Papa.parse(text, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          setRawData(results.data);
          setStatus(t("preview.loaded", { title: example.title }));
        },
      });
    } catch {
      setStatus("");
      toast.error(t("preview.error", { defaultValue: "Impossibile caricare il dataset" }));
    } finally {
      setLoading(false);
    }
  }

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      toast.success(t("examples.copied"));
    } catch {
      toast.error(t("examples.copyError", { defaultValue: "Impossibile copiare l'URL" }));
    }
  }

  return (
    <Layout>
      <div className="relative px-4 lg:px-10 py-14">
        <div className="mx-auto max-w-6xl pb-24 lg:pb-32">
          <h1 className="text-4xl">{t("title")}</h1>
          <p className="my-4 max-w-3xl">{t("intro")}</p>
          <p className="my-4 max-w-3xl">{t("howTo")}</p>
          <p className="my-4">
            {t("linkIntro")}{" "}
            <NewTabLink
              href="https://www.dati.gov.it/view-dataset?groups=governo&organization=pcm-dipartimento-trasformazione-digitale"
              className="link link-primary"
            >
              {t("link")}
            </NewTabLink>
          </p>

          <section aria-labelledby="examples-heading" className="mt-8">
            <h2 id="examples-heading" className="mb-4 text-2xl font-semibold">
              {t("examples.title")}
            </h2>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0">
              {examples.map((example) => (
                <li
                  key={example.title}
                  className="card border border-base-200 bg-base-100"
                >
                  <div className="card-body gap-2">
                    <h3 className="card-title text-base leading-snug">
                      {example.title}
                    </h3>
                    <p className="line-clamp-3 text-sm text-base-content/70">
                      {example.description}
                    </p>
                    {example.pubInfo && (
                      <p className="text-xs text-base-content/70">
                        {example.pubInfo}
                      </p>
                    )}
                    <ul className="mt-1 flex flex-wrap gap-1 list-none p-0 m-0">
                      {example.tags.map((tag) => (
                        <li key={tag} className="badge badge-outline badge-sm">
                          {tag}
                        </li>
                      ))}
                    </ul>
                    <div className="card-actions mt-2 justify-end gap-2">
                      {example.dataUrls.csv && (
                        <>
                          <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            aria-describedby="preview-heading"
                            onClick={() => viewExample(example)}
                          >
                            {t("examples.view")}
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline btn-primary"
                            onClick={() => copyUrl(example.dataUrls.csv as string)}
                          >
                            {t("examples.copyUrl")}
                          </button>
                        </>
                      )}
                      {example.dataUrls.json && (
                        <NewTabLink
                          href={example.dataUrls.json}
                          className="btn btn-sm btn-outline"
                        >
                          {t("examples.downloadJson")}
                        </NewTabLink>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section
            ref={previewRef}
            aria-labelledby="preview-heading"
            className="mt-12 scroll-mt-6"
          >
            <h2 id="preview-heading" className="mb-2 text-2xl font-semibold">
              {t("preview.title")}
            </h2>
            <p className="mb-4 max-w-3xl text-base-content/80">
              {t("preview.description")}
            </p>
            <div role="status" aria-live="polite" className="text-sm mb-2">
              {status}
            </div>
            <LoadSource
              key={selectedUrl}
              currentValue={selectedUrl}
              setData={(data) => handleChangeData(data)}
            />
            {loading && (
              <div className="mt-4">
                <span className="loading loading-spinner loading-sm" aria-hidden="true" />
              </div>
            )}
            {rawData && (
              <div className="mt-6">
                <div className="divider" />
                <DataMngTable
                  data={rawData}
                  onApplyData={() => undefined}
                  download={() => {
                    downloadCSV(dataToCSV(rawData), `remote-data-${Date.now()}`);
                  }}
                />
              </div>
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
}

export default LoadRemoteDataPage;
