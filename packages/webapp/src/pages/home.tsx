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

type GenericChartPaylod = {
  name: string;
  description: string;
};

type KpiGroupPayload = GenericChartPaylod;

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

  const { list, setList, showCreateKpiGroupModal, setShowCreateKpiGroupModal } =
    useChartsStoreState((state) => state);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [newKpiGroup, setNewKpiGroup] = useState<KpiGroupPayload>();
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
                        + Create New chart
                      </summary>
                      <ul className="menu dropdown-content bg-base-300 rounded-box z-1 w-52 p-2 shadow-lg border">
                        <li>
                          <a href="/edit/chart">Create Chart</a>
                        </li>
                        <li>
                          <a onClick={() => setShowCreateKpiGroupModal(true)}>
                            Create KpiGroup
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
          {showCreateKpiGroupModal && (
            <GenericDialog
              title="Aggiungi Dashboard"
              toggle={showCreateKpiGroupModal}
              labels={{ confirm: "Aggiungi", cancel: "Annulla" }}
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
              <div className="bg-base-200">
                <div className="p-4 my-5">
                  <label className="name">Nome</label>
                  <input
                    className="input w-full"
                    type="text"
                    name="name"
                    onChange={(e) => {
                      const name = e.target.value;
                      const oldValue = newKpiGroup ?? ({} as KpiGroupPayload);
                      setNewKpiGroup({ ...oldValue, name });
                    }}
                  />
                </div>
                <div className="p-4 my-5">
                  <label className="name">Descrizione</label>
                  <input
                    className="input w-full"
                    type="text"
                    name="description"
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
        </div>
      </div>
    </Layout>
  );
}

export default Home;
