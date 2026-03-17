import { useEffect } from "react";
import DataMngTable from "../../components/DataMngTable";
import GenerateRandomData from "../../components/GenerateRandomData";
import Layout from "../../components/layout";
import { dataToCSV, downloadCSV, downloadJSON } from "../../lib/downloadUtils";
import useStoreState from "../../lib/storeState";
import {
  getAvailablePalettes,
  getPalette,
  transposeData,
} from "../../lib/utils";
import { useTranslation } from "react-i18next";

function GenerateDataPage() {
  const { t } = useTranslation("pages", {
    keyPrefix: "utility.generateDataPage",
  });
  const { config, setConfig, rawData, setRawData, resetItem, setData } =
    useStoreState((state) => state);

  function reset() {
    resetItem();
    setData(null);
    setRawData(null);
  }
  function transpose() {
    setRawData(null);
    const transposed = transposeData(rawData);
    setTimeout(() => {
      handleChangeData(transposed);
    }, 300);
  }

  function handleChangeData(d: any) {
    if (!config.palette) {
      const numSeries = d.length - 1;
      const palette = getAvailablePalettes(numSeries)[0];
      config.palette = palette;
      config.colors = getPalette(palette);
      setConfig(config);
    }
    setRawData(d);
  }

  useEffect(() => {
    reset();
  }, []);

  return (
    <Layout>
      <div className="generate-data-page mx-auto max-w-4xl px-4">
        <header className="my-8">
          <h1 className="text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
            {t("header.title")}
          </h1>
          <p className="mt-2 text-base-content/70">{t("header.description")}</p>
        </header>

        <section className="mb-10">
          <GenerateRandomData setData={setRawData} />
        </section>

        {rawData && (
          <section className="rounded-2xl border border-base-200 bg-base-300 p-6 shadow-sm mb-8">
            <DataMngTable
              data={rawData}
              onApplyData={setRawData}
              download={() => {
                downloadCSV(dataToCSV(rawData), "generated-data-" + Date.now());
              }}
              downloadJSON={() => {
                downloadJSON(
                  JSON.stringify(rawData, null, 2),
                  "generated-data-" + Date.now(),
                );
              }}
            />
          </section>
        )}
      </div>
    </Layout>
  );
}

export default GenerateDataPage;
