import { useMachine } from "@xstate/react";
import { type FieldDataType } from "dataviz-components";
import { useEffect, useState } from "react";

import Layout from "../components/layout";
// import RenderChart from "../components/RenderChart";
import Loading from "../components/layout/Loading";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ChartTable from "../components/ChartTable";
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
  const { t } = useTranslation("pages", { keyPrefix: "home" });
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
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
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
    setPendingDeleteId(id);
  }

  function confirmDeleteChart() {
    if (!pendingDeleteId) return;
    api
      .deleteChart(pendingDeleteId)
      .then(() => fetchCharts())
      .then(() => send({ type: "IDLE" }))
      .finally(() => setPendingDeleteId(null));
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
        <div>
          {loading ? (
            <Loading />
          ) : (
            <>
              <h1 className="text-4xl font-bold">
                {t(`header.${list && list.length ? "myCharts" : "noCharts"}`)}
              </h1>

              <div>
                <div className="flex my-5 gap-4">
                  <details className="dropdown bg-base-100 z-10">
                    <summary
                      className="btn btn-primary"
                      role="button"
                      aria-haspopup="menu"
                    >
                      <span aria-hidden="true">+ </span>
                      {t(`body.actions.label`)}
                    </summary>
                    <ul
                      className="menu dropdown-content bg-base-300 rounded-box z-1 w-52 p-2 shadow-lg border"
                      role="menu"
                    >
                      <li role="none">
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => setShowCreateChartModal(true)}
                        >
                          {t(`body.actions.actionItems.createChart.label`)}
                        </button>
                      </li>
                      <li role="none">
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => setShowCreateKpiGroupModal(true)}
                        >
                          {t(`body.actions.actionItems.createKPIGroup.label`)}
                        </button>
                      </li>
                    </ul>
                  </details>
                </div>
                <ChartTable
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
            title={t(`modals.createKpiGroup.title`)}
            description={t(`modals.createKpiGroup.description`)}
            toggle={showCreateKpiGroupModal}
            labels={{
              confirm: t(`modals.createKpiGroup.labels.confirm`),
              cancel: t(`modals.createKpiGroup.labels.cancel`),
            }}
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
                  <span className="label-text font-medium">
                    {t(`modals.createKpiGroup.form.fields.name.label`)}*
                  </span>
                </label>
                <input
                  id="kpi-name"
                  className="input input-bordered w-full"
                  type="text"
                  name="name"
                  placeholder={t(
                    `modals.createKpiGroup.form.fields.name.placeholder`,
                  )}
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
                  <span className="label-text font-medium">
                    {t(`modals.createKpiGroup.form.fields.description.label`)}
                  </span>
                </label>
                <input
                  id="kpi-description"
                  className="input input-bordered w-full"
                  type="text"
                  name="description"
                  placeholder={t(
                    `modals.createKpiGroup.form.fields.description.placeholder`,
                  )}
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

        {/* Modal to creaqte Chart */}
        {showCreateChartModal && (
          <GenericDialog
            title={t(`modals.createChart.title`)}
            description={t(`modals.createChart.description`)}
            toggle={showCreateChartModal}
            labels={{
              confirm: isCreatingChart
                ? t(`modals.createChart.labels.confirm.isCreating`)
                : t(`modals.createChart.labels.confirm.default`),
              cancel: t(`modals.createChart.labels.cancel`),
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
                    {t(`modals.createChart.form.fields.name.label`)}*
                  </span>
                </label>
                <input
                  id="chart-name"
                  className="input input-bordered w-full"
                  type="text"
                  name="name"
                  placeholder={t(
                    `modals.createChart.form.fields.name.placeholder`,
                  )}
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
                    {t(`modals.createChart.form.fields.name.content`)}
                  </span>
                </label>
              </div>
            </div>
          </GenericDialog>
        )}
      </div>
      <GenericDialog
        toggle={!!pendingDeleteId}
        title={t(`body.confirms.deleteChart.label`)}
        description="This action cannot be undone."
        labels={{ cancel: t(`modals.cancel`), confirm: t(`modals.confirm`) }}
        confirmCb={confirmDeleteChart}
        cancelCb={() => setPendingDeleteId(null)}
      >
        <></>
      </GenericDialog>
    </Layout>
  );
}

export default Home;
