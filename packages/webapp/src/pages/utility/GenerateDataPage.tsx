import { useEffect } from "react";
import {
  getAvailablePalettes,
  getPalette,
  transposeData,
} from "../../lib/utils";
import Layout from "../../components/layout";
import DataTable from "../../components/DataTable";
import useStoreState from "../../lib/storeState";
import GenerateRandomData from "../../components/GenerateRandomData";
import { downloadCSV, dataToCSV, downloadJSON } from "../../lib/downloadUtils";

function Home() {
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
    // setChart("");
    setTimeout(() => {
      handleChangeData(transposed);
    }, 300);
  }

  function handleChangeData(d: any) {
    if (!config.palette) {
      const numSeries = d.length - 1;
      let palette = getAvailablePalettes(numSeries)[0];
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
      <div>
        <>
          <h4 className='text-4xl font-bold'>Generate data</h4>
          <GenerateRandomData setData={setRawData} />
        </>

        {rawData && (
          <div>
            <DataTable
              data={rawData}
              reset={reset}
              transpose={transpose}
              download={() => {
                downloadCSV(dataToCSV(rawData), "generated-data-" + Date.now());
              }}
              downloadJSON={() => {
                downloadJSON(
                  JSON.stringify(rawData, null, 2),
                  "generated-data-" + Date.now()
                );
              }}
            />
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Home;
