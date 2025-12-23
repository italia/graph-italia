import { useMachine } from "@xstate/react";
import { DataTable, RenderChart, type FieldDataType } from "dataviz-components";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ChartOptions from "../../components/ChartOptions";
import ChartSave from "../../components/ChartSave";
import Layout from "../../components/layout";
import SelectChart from "../../components/SelectChart";
import {
  getAvailablePalettes,
  getPalette,
  transposeData,
} from "../../lib/utils";

import ChooseLoader from "../../components/load-data/ChooseLoader";
import * as api from "../../lib/api";
import useChartsStoreState from "../../lib/chartListStore";
import stepMachine from "../../lib/stepMachine";
import useStoreState from "../../lib/storeState";

function Home() {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const [state, send] = useMachine(stepMachine);
  const {
    config,
    chart,
    data,
    id,
    name,
    description,
    publish,
    isRemote,
    remoteUrl,
    preview,
    dataSource,

    setPreview,
    setConfig,
    setChart,
    setData,
    setRemoteUrl,
    setIsRemote,

    loadItem,
    resetItem,
  } = useStoreState((state) => state);

  const { list, setList } = useChartsStoreState((state) => state);

  const [loading, setLoading] = useState(true);
  const [chartName, setChartName] = useState<string>("");

  async function fetchCharts() {
    setLoading(true);
    try {
      const data = await api.getCharts();
      setList(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  // Carica il grafico esistente quando c'è un paramId
  useEffect(() => {
    async function loadExistingChart() {
      if (paramId) {
        setLoading(true);
        try {
          const chartData = await api.getChart(paramId);
          if (chartData) {
            loadItem({ ...chartData, id: paramId });
            setChartName(chartData.name || "");
          }
        } catch (error) {
          console.error("Errore nel caricamento del grafico:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
    loadExistingChart();
    fetchCharts();
  }, [paramId]);

  function reset() {
    setData(null);
  }
  function transpose() {
    setData(null);
    const transposed = transposeData(data);
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
    // setChart("");
    setData(d);
    send({ type: "CONFIG" });
  }
  const haveData =
    data && data[0].length > 0 ? true : dataSource ? true : false;

  function handleUpload(d: any) {
    setData(d);
    send({ type: "NEXT" });
  }
  function handleSetRemoteData(d: any) {
    console.log("handleSetRemoteData", d);
    setIsRemote(true);
    setRemoteUrl(d.remoteUrl);
    setData(d.data);
    setTimeout(() => {
      send({ type: "CONFIG" });
    }, 100);
  }

  function handleLoadChart(item: FieldDataType) {
    send({ type: "CONFIG" });
    loadItem(item);
  }

  function handleDeleteChart(id?: string) {
    if (!id) return;
    console.log("delete chart?", id);

    const sure = confirm("Are you sure you want to delete this chart?");
    if (!sure) return;

    return api
      .deleteChart(id)
      .then(() => fetchCharts())
      .then(() => send({ type: "IDLE" }));
  }
  function handleSaveChart() {
    fetchCharts().then(() => send({ type: "IDLE" }));
    setTimeout(() => {
      resetItem();
    }, 100);
  }

  return (
    <Layout>
      <div className="p-4">
        <button
          onClick={() => navigate("/home")}
          className="btn btn-outline btn-sm mb-4"
        >
          ← Torna alla lista
        </button>
        <h1 className="text-3xl font-bold mb-2">
          {paramId ? `Modifica Grafico` : "Nuovo Grafico"}
        </h1>
        {chartName && (
          <p className="text-lg text-base-content/70 mb-4">{chartName}</p>
        )}
        {(state.matches("idle") || state.matches("input")) && (
          <div className="container">
            <h4 className="text-4xl font-bold">Upload your data</h4>
            <ChooseLoader
              handleUpload={handleUpload}
              remoteUrl={remoteUrl}
              handleSetRemoteData={handleSetRemoteData}
            />
          </div>
        )}
        {state.matches("config") && (
          <div className="container">
            <h4 className="text-4xl font-bold">Configure Chart</h4>
            <SelectChart setChart={setChart} chart={chart} />
            <ChartOptions
              config={config}
              setConfig={setConfig}
              chart={chart}
              numSeries={(data as any)?.length - 1 || 0}
            />
          </div>
        )}
        {state.matches("done") && (
          <div className="container">
            <h4 className="text-4xl font-bold">Salva Grafico</h4>
            <p className="text-base-content/70 mb-4">
              Dai un nome al tuo grafico e salvalo
            </p>
            <ChartSave
              item={{
                id: paramId || id,
                chart,
                name: chartName || name,
                description,
                publish,
                config,
                data,
                remoteUrl,
                isRemote,
                preview,
              }}
              handleSave={() => handleSaveChart()}
            />
          </div>
        )}
      </div>

      {haveData && (
        <>
          <div className="p-4">
            <DataTable
              data={data as any}
              // transpose={transpose}
              // download={() => {
              //   downloadCSV(dataToCSV(data), 'selected-data-' + Date.now());
              // }}
            />
            {chart && (
              <>
                <RenderChart
                  chart={chart}
                  data={data}
                  config={config}
                  dataSource={null}
                  getPicture={(pic: string) => setPreview(pic)}
                />
                {config && chart && (
                  <div className="w-full flex justify-end">
                    <button
                      className="my-5 btn btn-primary"
                      onClick={() => send({ type: "DONE" })}
                    >
                      SAVE / EXPORT
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </Layout>
  );
}

export default Home;
