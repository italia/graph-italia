import { useMachine } from "@xstate/react";
import { type FieldDataType } from "dataviz-components";
import { useEffect, useState } from "react";

import Layout from "../components/layout";
// import RenderChart from "../components/RenderChart";
import ChartList from "../components/ChartList";
import Loading from "../components/layout/Loading";
import QuickstartInfo from "../components/layout/QuickstartInfo";

import { useNavigate } from "react-router-dom";
import GenericDialog from "../components/layout/GenericDialog";
import * as api from "../lib/api";
import useChartsStoreState from "../lib/chartListStore";
import stepMachine from "../lib/stepMachine";
import useStoreState from "../lib/storeState";

type GenericChartPayload = {
  name: string;
  description?: string;
};

type KpiGroupPayload = GenericChartPayload;
type ChartPayload = GenericChartPayload;

async function createKpiGroup(payload: KpiGroupPayload) {
  return api.createKpiGroup(payload);
}

function Home() {
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

  const {
    list,
    setList,
    showCreateKpiGroupModal,
    setShowCreateKpiGroupModal,
    showCreateChartModal,
    setShowCreateChartModal,
  } = useChartsStoreState((state) => state);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [newKpiGroup, setNewKpiGroup] = useState<KpiGroupPayload>();
  const [newChart, setNewChart] = useState<ChartPayload>();
  const [isCreatingChart, setIsCreatingChart] = useState(false);
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

  useEffect(() => {
    fetchCharts();
  }, []);

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

  function navigateToKpiGroupEdit(id?: string) {
    if (!id) {
      throw new Error();
    }
    navigate(`/edit/kpi/${id}`);
  }

  function navigateToChartEdit(id?: string) {
    if (!id) {
      throw new Error("ID del grafico mancante");
    }
    navigate(`/edit/chart/${id}`);
  }

  async function showCreateKpiGroupConfirmHandler(payload: KpiGroupPayload) {
    const response = await createKpiGroup(payload);
    if (!response) {
      return;
    }
    const { id } = response;
    setShowCreateKpiGroupModal(false);
    setNewKpiGroup(undefined);
    navigateToKpiGroupEdit(id);
  }

  function showCreateKpiGroupCancelHandler() {
    setShowCreateKpiGroupModal(false);
  }

  async function showCreateChartConfirmHandler(payload: ChartPayload) {
    if (!payload.name?.trim()) {
      return;
    }
    setIsCreatingChart(true);
    try {
      const response = await api.createChart(payload);
      if (!response) {
        return;
      }
      const { id } = response;
      setShowCreateChartModal(false);
      setNewChart(undefined);
      navigateToChartEdit(id);
    } catch (error) {
      console.error("Errore nella creazione del grafico:", error);
    } finally {
      setIsCreatingChart(false);
    }
  }

  function showCreateChartCancelHandler() {
    setShowCreateChartModal(false);
    setNewChart(undefined);
  }

  return (
    <Layout>
      <div className="p-4">
        <div className="container">
          <div>
            {loading ? (
              <Loading />
            ) : (
              <>
                <h4 className="text-4xl font-bold">
                  {list && list.length ? "My Charts" : "Welcome"}
                </h4>

                {!data && (!list || list?.length === 0) && <QuickstartInfo />}
                <div>
                  <div className="flex my-b gap-4">
                    <details className="dropdown my-10 bg-base-100 z-10">
                      <summary className="btn btn-primary m-1">
                        {" "}
                        + Crea nuovo
                      </summary>
                      <ul className="menu dropdown-content bg-base-300 rounded-box z-1 w-52 p-2 shadow-lg border">
                        <li>
                          <a onClick={() => setShowCreateChartModal(true)}>
                            Crea Grafico
                          </a>
                        </li>
                        <li>
                          <a onClick={() => setShowCreateKpiGroupModal(true)}>
                            Crea Gruppo KPI
                          </a>
                        </li>
                      </ul>
                    </details>
                  </div>
                  <ChartList
                    list={list as FieldDataType[]}
                    handleLoadChart={handleLoadChart}
                    handleDeleteChart={handleDeleteChart}
                  />
                </div>
              </>
            )}
          </div>
          {/* Modal per creare Gruppo KPI */}
          {showCreateKpiGroupModal && (
            <GenericDialog
              title="Crea Gruppo KPI"
              description="Inserisci i dati per creare un nuovo gruppo di indicatori KPI"
              toggle={showCreateKpiGroupModal}
              labels={{ confirm: "Crea", cancel: "Annulla" }}
              confirmDisabled={!newKpiGroup?.name?.trim()}
              confirmCb={() => {
                if (!newKpiGroup) {
                  return;
                }
                showCreateKpiGroupConfirmHandler(newKpiGroup);
              }}
              cancelCb={() => {
                showCreateKpiGroupCancelHandler();
              }}
            >
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label" htmlFor="kpi-name">
                    <span className="label-text font-medium">Nome *</span>
                  </label>
                  <input
                    id="kpi-name"
                    className="input input-bordered w-full"
                    type="text"
                    name="name"
                    placeholder="Inserisci il nome del gruppo KPI"
                    autoFocus
                    onChange={(e) => {
                      const name = e.target.value;
                      const oldValue = newKpiGroup ?? ({} as KpiGroupPayload);
                      setNewKpiGroup({ ...oldValue, name });
                    }}
                  />
                </div>
                <div className="form-control">
                  <label className="label" htmlFor="kpi-description">
                    <span className="label-text font-medium">Descrizione</span>
                  </label>
                  <input
                    id="kpi-description"
                    className="input input-bordered w-full"
                    type="text"
                    name="description"
                    placeholder="Inserisci una descrizione (opzionale)"
                    onChange={(e) => {
                      const description = e.target.value;
                      const oldValue = newKpiGroup ?? ({} as KpiGroupPayload);
                      setNewKpiGroup({ ...oldValue, description });
                    }}
                  />
                </div>
              </div>
            </GenericDialog>
          )}

          {/* Modal per creare Grafico - Conforme Design System Italia */}
          {showCreateChartModal && (
            <GenericDialog
              title="Crea nuovo grafico"
              description="Dai un nome al tuo grafico per iniziare a modificarlo"
              toggle={showCreateChartModal}
              labels={{
                confirm: isCreatingChart ? "Creazione..." : "Crea",
                cancel: "Annulla",
              }}
              confirmDisabled={!newChart?.name?.trim() || isCreatingChart}
              confirmCb={() => {
                if (!newChart) {
                  return;
                }
                showCreateChartConfirmHandler(newChart);
              }}
              cancelCb={() => {
                showCreateChartCancelHandler();
              }}
            >
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label" htmlFor="chart-name">
                    <span className="label-text font-medium">
                      Nome del grafico *
                    </span>
                  </label>
                  <input
                    id="chart-name"
                    className="input input-bordered w-full"
                    type="text"
                    name="name"
                    placeholder="Es: Vendite mensili 2024"
                    autoFocus
                    value={newChart?.name || ""}
                    onChange={(e) => {
                      const name = e.target.value;
                      const oldValue = newChart ?? ({} as ChartPayload);
                      setNewChart({ ...oldValue, name });
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newChart?.name?.trim()) {
                        showCreateChartConfirmHandler(newChart);
                      }
                    }}
                  />
                  <label className="label">
                    <span className="label-text-alt text-base-content/60">
                      Potrai modificare il nome in seguito
                    </span>
                  </label>
                </div>
              </div>
            </GenericDialog>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Home;
