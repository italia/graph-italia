import { RenderChart } from "dataviz-components";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../components/layout";
import Dialog from "../../../components/layout/Dialog";
import Loading from "../../../components/layout/Loading";
import { KpiConfigForm, KpiForm, KpiFormValues } from "./components";
import useEditKpiGroupStore from "./store";

function EditKpiGroup() {
  const { id } = useParams();
  const {
    load,
    reload,
    save,
    addKpi,
    deleteKpi,
    saveKpi,
    closeFormModal,
    showConfigFormModal,
    closeConfigFormModal,
    showConfigModal,
    showFormModal,
    vm,
    kpiGroup,
    isLoading,
    loaded,
    error,
  } = useEditKpiGroupStore();

  function changeConfigHandler() {
    showConfigFormModal();
  }

  function addKpiHandler() {
    addKpi();
  }

  function deleteKpiHandler(index: number) {
    deleteKpi(index);
  }

  function saveKpiHandler(data: KpiFormValues) {
    //update store with new kpi
    console.log("KPI data to save:", data);
    saveKpi(data);
    //close form modal
    closeFormModal();
  }

  async function saveHandler() {
    const response = await save();
    if (response) {
      reload();
    }
  }

  function resetHandler() {
    reload();
  }

  useEffect(() => {
    if (id) {
      load(id);
    }
  }, []);

  return (
    <Layout>
      <div className="p-4">
        <div className="flex justify-between items-center">
          <Link to="/home" className="text-blue-500 hover:underline">
            &lt; Torna alla lista
          </Link>
          <div className="ml-auto flex space-x-2">
            <button onClick={resetHandler} className="btn btn-primary">
              Reset
            </button>
            <button onClick={saveHandler} className="btn btn-primary">
              Salva
            </button>
          </div>
        </div>
        {isLoading && <Loading />}
        {error && (
          <div role="alert" className="alert alert-error">
            {error.message}
          </div>
        )}
        {loaded && (
          <>
            <h1 className="text-4xl font-bold">{vm.name}</h1>
            <h4 className="text-xl">{vm.description}</h4>
            <div className="flex flex-wrap items-center">
              {/* <button
                className="m-2 btn btn-xs btn-primary"
                onClick={changeConfigHandler}
              >
                Cambia configurazione
              </button> */}
              <button
                className="m-2 btn btn-xs btn-primary"
                onClick={addKpiHandler}
              >
                Aggiungi KPI +
              </button>
              {kpiGroup.dataSource.map(
                (
                  ds: {
                    title: string;
                  },
                  index: number
                ) => (
                  <button
                    key={`${ds.title}-${index}`}
                    className="m-2 btn btn-xs btn-error"
                    onClick={() => deleteKpiHandler(index)}
                  >
                    {ds.title}
                  </button>
                )
              )}
            </div>
            <div className="relative border min-h-[60vh]">
              {kpiGroup.dataSource.length === 0 && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500">
                  Nessun KPI presente. Aggiungi un nuovo KPI.
                </div>
              )}
              {kpiGroup.dataSource.length > 0 && (
                <div className="p-4 space-y-4">
                  <div className="p-4 border rounded-md shadow-sm">
                    <RenderChart {...kpiGroup}></RenderChart>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
        {showFormModal && (
          <Dialog
            toggle={showFormModal}
            title="KPI"
            callback={() => {
              closeFormModal();
            }}
          >
            <div>Form to add or edit a KPI</div>
            <KpiForm onSubmit={saveKpiHandler} />
          </Dialog>
        )}
        {showConfigModal && (
          <Dialog
            toggle={showConfigModal}
            title="Configura Kpi Group"
            callback={() => {
              closeConfigFormModal();
            }}
          >
            <div>Form to configure Kpi Group</div>
            <KpiConfigForm />
          </Dialog>
        )}
      </div>
    </Layout>
  );
}

export default EditKpiGroup;
