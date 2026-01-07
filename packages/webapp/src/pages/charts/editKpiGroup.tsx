import { useEffect } from "react";

import { Link, useParams } from "react-router-dom";
import Layout from "../../components/layout";
import Loading from "../../components/layout/Loading";
import useEditKpiGroupStore from "./editKpiGroupStore";

function EditKpiGroup() {
  const { id } = useParams();
  const { load, reload, save, vm, isLoading, loaded, error } =
    useEditKpiGroupStore();

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
          </>
        )}
      </div>
    </Layout>
  );
}

export default EditKpiGroup;
