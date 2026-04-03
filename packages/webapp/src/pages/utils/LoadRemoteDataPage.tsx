import { useRef } from "react";
import { useTranslation } from "react-i18next";
import DataMngTable from "../../components/DataMngTable";
import Layout from "../../components/layout";
import LoadSource from "../../components/load-data/LoadRemoteCSVSource";
import examples from "../../data/examples.json";
import { dataToCSV, downloadCSV, downloadJSON } from "../../lib/downloadUtils";
import useStoreState from "../../lib/store/storeState";

function Home() {
  const { t } = useTranslation("pages", {
    keyPrefix: "utility.loadRemoteDataPage",
  });
  const { rawData, setRawData } =
    useStoreState((state) => state);
  const formRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleChangeData(d: any) {
    const matrix = d?.data ?? d;
    setRawData(matrix);
  }

  function handleLoadCsv(url: string) {
    setRawData(null);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    const input = document.querySelector<HTMLInputElement>('input[type="text"]');
    if (input) {
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      )?.set;
      setter?.call(input, url);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }

  return (
    <Layout>
      <div className='relative px-10 py-14'>
        <div className='mx-auto max-w-6xl pb-24 lg:pb-32'>

          <div ref={formRef} />
          <h4 className="text-4xl">{t("title")}</h4>
          <div className="my-4">
            {t("description")}: <br />
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.dati.gov.it/view-dataset?groups=governo&organization=pcm-dipartimento-trasformazione-digitale"
              className="link link-primary"
            >
              {t("link")}
            </a>
          </div>
          <LoadSource currentValue={""} setData={(data) => handleChangeData(data)} />

          {rawData && (
            <div className="mt-6">
              <div className="divider" />
              <DataMngTable
                data={rawData}
                onApplyData={() => console.log("applyData")}
                download={() => {
                  downloadCSV(dataToCSV(rawData), `remote-data-${Date.now()}`);
                }}
              />
            </div>
          )}
          <div className="divider my-6" />

          <h5 className="mb-4 text-2xl font-semibold">Esempi disponibili</h5>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {examples.map((example) => (
              <div
                key={example.title}
                className="card border border-base-200 bg-base-100 shadow-md"
              >
                <div className="card-body gap-2">
                  <h2 className="card-title text-base leading-snug">
                    {example.title}
                  </h2>
                  <p className="line-clamp-3 text-sm text-base-content/70">
                    {example.description}
                  </p>
                  {example.pubInfo && (
                    <p className="text-xs text-base-content/50">
                      {example.pubInfo}
                    </p>
                  )}
                  <div className="mt-1 flex flex-wrap gap-1">
                    {example.tags.map((tag) => (
                      <span key={tag} className="badge badge-outline badge-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="card-actions mt-2 justify-end gap-2">
                    {example.dataUrls.csv && (
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={() => {
                          if (example.dataUrls.csv) handleLoadCsv(example.dataUrls.csv);
                        }}
                      >
                        Carica CSV
                      </button>
                    )}
                    {example.dataUrls.json && (
                      <a
                        href={example.dataUrls.csv}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline"
                      >
                        Download
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>


        </div>
      </div>
    </Layout>
  );
}

export default Home;
