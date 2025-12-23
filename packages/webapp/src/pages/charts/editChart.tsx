import { useMachine } from "@xstate/react";
import { DataTable, RenderChart, type FieldDataType } from "dataviz-components";
import "dataviz-components/dist/style.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ChartOptions from "../../components/ChartOptions";
import ChartSave from "../../components/ChartSave";
import Layout from "../../components/layout";
import Loading from "../../components/layout/Loading";
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

// Definizione degli step per il wizard di creazione grafico
const STEPS = [
  { id: "input", label: "Carica dati", description: "Importa i tuoi dati" },
  { id: "config", label: "Configura", description: "Personalizza il grafico" },
  { id: "done", label: "Salva", description: "Salva e pubblica" },
];

function EditChartPage() {
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

  // Ref per sincronizzare l'altezza della card destra con quella sinistra
  const leftCardRef = useRef<HTMLDivElement>(null);
  const [leftCardHeight, setLeftCardHeight] = useState<number | null>(null);

  // Aggiorna l'altezza quando cambia il contenuto della card sinistra
  const updateLeftCardHeight = useCallback(() => {
    if (leftCardRef.current) {
      setLeftCardHeight(leftCardRef.current.offsetHeight);
    }
  }, []);

  // Osserva i cambiamenti di dimensione della card sinistra
  useEffect(() => {
    updateLeftCardHeight();

    // Usa ResizeObserver per rilevare cambiamenti di dimensione
    const resizeObserver = new ResizeObserver(() => {
      updateLeftCardHeight();
    });

    if (leftCardRef.current) {
      resizeObserver.observe(leftCardRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [updateLeftCardHeight, state.value, data]);

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
    // Non transizionare automaticamente - l'utente deve cliccare "Procedi alla configurazione"
  }
  const haveData =
    data && data[0].length > 0 ? true : dataSource ? true : false;

  function handleUpload(d: any) {
    setData(d);
    // Non transizionare automaticamente - l'utente deve cliccare "Procedi alla configurazione"
    if (state.matches("idle")) {
      send({ type: "NEXT" }); // Solo da idle a input
    }
  }
  function handleSetRemoteData(d: any) {
    console.log("handleSetRemoteData", d);
    setIsRemote(true);
    setRemoteUrl(d.remoteUrl);
    setData(d.data);
    // Non transizionare automaticamente - l'utente deve cliccare "Procedi alla configurazione"
    if (state.matches("idle")) {
      send({ type: "NEXT" }); // Solo da idle a input
    }
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

  // Determina lo step corrente per la visualizzazione
  const getCurrentStepIndex = () => {
    if (state.matches("idle") || state.matches("input")) return 0;
    if (state.matches("config")) return 1;
    if (state.matches("done")) return 2;
    return 0;
  };

  const currentStepIndex = getCurrentStepIndex();

  if (loading) {
    return (
      <Layout>
        <div className="p-6">
          <Loading />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header con navigazione e titolo */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4 -ml-2">
            {/* Step 1: Solo "Torna alla lista" */}
            {(state.matches("idle") || state.matches("input")) && (
              <button
                onClick={() => navigate("/home")}
                className="btn btn-ghost btn-sm gap-2 text-base-content/70 hover:text-base-content"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Torna alla lista
              </button>
            )}

            {/* Step 2: "Torna ai dati" */}
            {state.matches("config") && (
              <button
                onClick={() => send({ type: "IDLE" })}
                className="btn btn-ghost btn-sm gap-2 text-base-content/70 hover:text-base-content"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Torna ai dati
              </button>
            )}

            {/* Step 3: "Torna alla configurazione" */}
            {state.matches("done") && (
              <button
                onClick={() => send({ type: "CONFIG" })}
                className="btn btn-ghost btn-sm gap-2 text-base-content/70 hover:text-base-content"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Torna alla configurazione
              </button>
            )}

            {/* Separatore e link alla lista (per step 2 e 3) */}
            {(state.matches("config") || state.matches("done")) && (
              <>
                <span className="text-base-content/30">|</span>
                <button
                  onClick={() => navigate("/home")}
                  className="btn btn-ghost btn-sm gap-1 text-base-content/50 hover:text-base-content"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Lista
                </button>
              </>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-3xl font-bold text-base-content">
                {paramId ? "Modifica Grafico" : "Nuovo Grafico"}
              </h1>
              {chartName && (
                <p className="text-lg text-base-content/60 mt-1">{chartName}</p>
              )}
            </div>
          </div>
        </div>

        {/* Stepper - Indicatore di progresso */}
        <div className="mb-8">
          <ul className="steps steps-horizontal w-full">
            {STEPS.map((step, index) => (
              <li
                key={step.id}
                className={`step ${
                  index <= currentStepIndex ? "step-primary" : ""
                }`}
                data-content={index < currentStepIndex ? "✓" : index + 1}
              >
                <div className="hidden sm:block">
                  <span className="font-medium">{step.label}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Contenuto principale in due colonne */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Colonna sinistra: Form/Configurazione */}
          <div className="space-y-6">
            {/* Step 1: Caricamento dati */}
            {(state.matches("idle") || state.matches("input")) && (
              <div
                ref={leftCardRef}
                className="card bg-base-100 shadow-sm border border-base-200"
              >
                <div className="card-body">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold">1</span>
                    </div>
                    <div>
                      <h2 className="card-title text-xl">Carica i tuoi dati</h2>
                      <p className="text-sm text-base-content/60">
                        Importa dati da file CSV, JSON o da una sorgente remota
                      </p>
                    </div>
                  </div>
                  <ChooseLoader
                    handleUpload={handleUpload}
                    remoteUrl={remoteUrl}
                    handleSetRemoteData={handleSetRemoteData}
                    initialData={data}
                  />

                  {/* Pulsante per procedere alla configurazione */}
                  {haveData && chart && (
                    <div className="card-actions justify-end mt-6 pt-4 border-t border-base-200">
                      <button
                        className="btn btn-primary"
                        onClick={() => send({ type: "CONFIG" })}
                      >
                        Procedi alla configurazione
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Configurazione */}
            {state.matches("config") && (
              <div className="card bg-base-100 shadow-sm border border-base-200">
                <div className="card-body">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold">2</span>
                    </div>
                    <div>
                      <h2 className="card-title text-xl">
                        Configura il grafico
                      </h2>
                      <p className="text-sm text-base-content/60">
                        Scegli il tipo di grafico e personalizza l'aspetto
                      </p>
                    </div>
                  </div>
                  <SelectChart setChart={setChart} chart={chart} />
                  <div className="divider my-2"></div>
                  <ChartOptions
                    config={config}
                    setConfig={setConfig}
                    chart={chart}
                    numSeries={(data as any)?.length - 1 || 0}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Salvataggio */}
            {state.matches("done") && (
              <div className="card bg-base-100 shadow-sm border border-base-200">
                <div className="card-body">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold">3</span>
                    </div>
                    <div>
                      <h2 className="card-title text-xl">Salva il grafico</h2>
                      <p className="text-sm text-base-content/60">
                        Dai un nome al grafico e scegli se pubblicarlo
                      </p>
                    </div>
                  </div>
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
              </div>
            )}
          </div>

          {/* Colonna destra: Anteprima */}
          <div className="space-y-6">
            {haveData && (
              <>
                {/* Card Anteprima Dati - Visibile solo in Step 1 */}
                {(state.matches("idle") || state.matches("input")) && (
                  <div
                    className="card bg-base-100 shadow-sm border border-base-200 flex flex-col"
                    style={{
                      maxHeight: leftCardHeight
                        ? `${leftCardHeight}px`
                        : "500px",
                    }}
                  >
                    <div className="card-body flex flex-col min-h-0">
                      <h3 className="card-title text-lg flex items-center gap-2 flex-shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-base-content/60"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 3v4M15 3v4M4 11h16"
                          />
                        </svg>
                        Anteprima dati
                      </h3>
                      <div className="overflow-auto flex-1 min-h-0">
                        <DataTable data={data as any} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Card Anteprima Grafico - Visibile solo da Step 2 in poi, Sticky in fase di configurazione */}
                {chart &&
                  (state.matches("config") || state.matches("done")) && (
                    <div
                      className={`card bg-base-100 shadow-sm border border-base-200 ${
                        state.matches("config") ? "sticky top-4" : ""
                      }`}
                    >
                      <div className="card-body">
                        <h3 className="card-title text-lg flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-base-content/60"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                          </svg>
                          Anteprima grafico
                        </h3>
                        <div className="mt-4 overflow-auto max-h-[500px]">
                          <RenderChart
                            chart={chart}
                            data={data}
                            config={config}
                            dataSource={null}
                            getPicture={(pic: string) => setPreview(pic)}
                          />
                        </div>
                        {/* Pulsante per procedere al salvataggio (solo in Step 2) */}
                        {state.matches("config") && (
                          <div className="card-actions justify-end mt-4">
                            <button
                              className="btn btn-primary"
                              onClick={() => send({ type: "DONE" })}
                            >
                              Procedi al salvataggio
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 ml-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
              </>
            )}

            {/* Placeholder quando non ci sono dati */}
            {!haveData && (
              <div className="card bg-base-200/50 border-2 border-dashed border-base-300 min-h-[300px]">
                <div className="card-body items-center justify-center text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-base-content/30 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-base-content/60">
                    Anteprima grafico
                  </h3>
                  <p className="text-sm text-base-content/40 max-w-xs">
                    Carica i tuoi dati per visualizzare l'anteprima del grafico
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default EditChartPage;
