import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import DataTable from "../../components/DataMngTable";
import Layout from "../../components/layout";
import LoadSource from "../../components/load-data/LoadRemoteCSVSource";
import { dataToCSV, downloadCSV } from "../../lib/downloadUtils";
import useStoreState from "../../lib/storeState";
import {
  getAvailablePalettes,
  getPalette,
  transposeData,
} from "../../lib/utils";

function Home() {
  const { t } = useTranslation("pages", {
    keyPrefix: "utility.loadRemoteDataPage",
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
    // setChart("");
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
      <div>
        <>
          <h4 className="text-4xl">{t("title")}</h4>
          <div className="my-4">
            {t("description")}: <br />
            <a
              target="_blank"
              href="https://www.dati.gov.it/view-dataset?groups=governo&organization=pcm-dipartimento-trasformazione-digitale"
              className="link link-primary"
            >
              {t("link")}
            </a>
          </div>
          <LoadSource currentValue={""} setData={setRawData} />
        </>
        {rawData && (
          <div>
            <DataTable
              data={rawData}
              onApplyData={setRawData}
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
