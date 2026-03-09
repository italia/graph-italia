import { useEffect } from "react";
import DataTable from "../../components/DataMngTable";
import GenerateRandomPoi from "../../components/GenerateRandomPoi";
import Layout from "../../components/layout";
import {  downloadJSON ,downloadCSV, dataToCSV} from "../../lib/downloadUtils";
import useStoreState from "../../lib/storeState";

import type { PointData, FieldDataType } from "dataviz-components";
import { RenderChart} from "dataviz-components";
import { data } from "react-router-dom";

export default  function GeneratePoiPage() {
  const { config, setConfig, dataSource, resetItem, setDataSource, rawData, setRawData } =
    useStoreState((state) => state);

  function reset() {
    resetItem();
    setDataSource([]);
    setRawData([]);
  }

  const samplData: FieldDataType = {
    id: "clustermap1",
    dataSource:[  ],
    chart: "cmap",
    config: {
      direction: "horizontal",
      h: 500,
      labeLine: false,
      legend: false,
      legendPosition: "",
      palette: [],
      tooltip: false,
      tooltipFormatter: "",
      valueFormatter: "",
      totalLabel: "",
      tooltipTrigger: "",
      colors: [],
    },
    data: null,
  };

  useEffect(() => {
    reset();
  }, []);


function JsonObjectArrayToCsvTable(jsonArray: []){
  const headers = Object.keys(jsonArray[0]);
  const rows= jsonArray.map(( item: any) => {
        return Object.values(item) ;
    });
    return [
      headers,
      ...rows
    ]
}

function handleData(jsonArray: []){
  setDataSource(jsonArray);
  setRawData(JsonObjectArrayToCsvTable(jsonArray));
}

  return (
    <Layout>
      <div className="generate-data-page mx-auto max-w-4xl px-4">
        <header className="my-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Generate POI data
          </h1>
          <p className="mt-2 text-gray-600">
            Create a random POI dataset. Use it to try charts or export as CSV/JSON.
          </p>
        </header>

        <section className="mb-10">
          <GenerateRandomPoi setData={handleData} />
        </section>

         {dataSource && dataSource.length>0 && (
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm mb-8">
            <RenderChart {...{...samplData, dataSource}}/>
          </section>
        )}

        {dataSource && dataSource.length>0 && rawData && (
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm mb-8">
            <DataTable
              data={rawData}
              downloadJSON={() => {
                downloadJSON(
                  JSON.stringify(dataSource, null, 2),
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


