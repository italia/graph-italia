import { useEffect } from "react";

import { Link, useParams } from "react-router-dom";
import Layout from "../../components/layout";
import Dialog from "../../components/layout/Dialog";
import Loading from "../../components/layout/Loading";
import useEditKpiGroupStore from "./editKpiGroupStore";

function EditKpiGroup() {
  const { id } = useParams();
  const {
    load,
    reload,
    save,
    addKpi,
    closeFormModal,
    showFormModal,
    vm,
    isLoading,
    loaded,
    error,
  } = useEditKpiGroupStore();

  function addKpiHandler() {
    addKpi();
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
              <button
                className="m-2 btn btn-xs btn-primary"
                onClick={addKpiHandler}
              >
                Aggiungi KPI +
              </button>
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
          </Dialog>
        )}
      </div>
    </Layout>
  );
}

export default EditKpiGroup;
