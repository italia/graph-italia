import { useEffect } from "react";
import {
  getAvailablePalettes,
  getPalette,
  transposeData,
} from "../../lib/utils";
import Layout from "../../components/layout";
import DataTable from "../../components/DataTable";
import useStoreState from "../../lib/storeState";
import LoadSource from "../../components/LoadCSVSource";
import { downloadCSV, dataToCSV } from "../../lib/downloadUtils";

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
          <h4 className='text-4xl'>Load remote data</h4>
          <div className='my-4'>
            Here some Open Data sources of real data you can use here: <br />
            <a
              target='_blank'
              href='https://www.dati.gov.it/view-dataset?groups=governo&organization=pcm-dipartimento-trasformazione-digitale'
              className='link link-primary'
            >
              Dati Italia, Governo e servizi pubblici
            </a>
          </div>
          <LoadSource setRawData={setRawData} />
        </>
        {rawData && (
          <div>
            <DataTable
              data={rawData}
              reset={reset}
              transpose={transpose}
              download={() => {
                downloadCSV(dataToCSV(rawData), "remote-data-" + Date.now());
              }}
            />
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Home;
