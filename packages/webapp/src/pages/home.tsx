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
  return new Promise<{ id: string }>((resolve) => resolve({ id: "fakeId" }));
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
      throw new Error("Missing chart ID");
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
      console.error("Error creating chart:", error);
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
                        + Create new
                      </summary>
                      <ul className="menu dropdown-content bg-base-300 rounded-box z-1 w-52 p-2 shadow-lg border">
                        <li>
                          <a onClick={() => setShowCreateChartModal(true)}>
                            Create Chart
                          </a>
                        </li>
                        <li>
                          <a onClick={() => setShowCreateKpiGroupModal(true)}>
                            Create KPI Group
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
          {/* Modal to create KPI Group */}
          {showCreateKpiGroupModal && (
            <GenericDialog
              title="Create KPI Group"
              description="Enter data to create a new KPI indicator group"
              toggle={showCreateKpiGroupModal}
              labels={{ confirm: "Create", cancel: "Cancel" }}
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
                    <span className="label-text font-medium">Name *</span>
                  </label>
                  <input
                    id="kpi-name"
                    className="input input-bordered w-full"
                    type="text"
                    name="name"
                    placeholder="Enter the KPI group name"
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
                    <span className="label-text font-medium">Description</span>
                  </label>
                  <input
                    id="kpi-description"
                    className="input input-bordered w-full"
                    type="text"
                    name="description"
                    placeholder="Enter a description (optional)"
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

          {/* Modal to create Chart */}
          {showCreateChartModal && (
            <GenericDialog
              title="Create new chart"
              description="Name your chart to start editing it"
              toggle={showCreateChartModal}
              labels={{
                confirm: isCreatingChart ? "Creating..." : "Create",
                cancel: "Cancel",
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
                    <span className="label-text font-medium">Chart name *</span>
                  </label>
                  <input
                    id="chart-name"
                    className="input input-bordered w-full"
                    type="text"
                    name="name"
                    placeholder="E.g.: Monthly sales 2024"
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
                      You can change the name later
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
