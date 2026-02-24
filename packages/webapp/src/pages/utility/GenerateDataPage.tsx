import { useEffect } from "react";
import DataTable from "../../components/OldDataTable";
import GenerateRandomData from "../../components/GenerateRandomData";
import Layout from "../../components/layout";
import { dataToCSV, downloadCSV, downloadJSON } from "../../lib/downloadUtils";
import useStoreState from "../../lib/storeState";
import {
  getAvailablePalettes,
  getPalette,
  transposeData,
} from "../../lib/utils";

function GenerateDataPage() {
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
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Generate data
          </h1>
          <p className="mt-2 text-gray-600">
            Create a random dataset with configurable rows, columns and value
            range. Use it to try charts or export as CSV/JSON.
          </p>
        </header>

        <section className="mb-10">
          <GenerateRandomData setData={setRawData} />
        </section>

        {rawData && (
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm mb-8">
            <DataTable
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
              buttonVariant="italia"
            />
          </section>
        )}
      </div>
    </Layout>
  );
}

export default GenerateDataPage;
