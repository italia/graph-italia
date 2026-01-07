import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../components/layout";
import Dialog from "../../../components/layout/Dialog";
import Loading from "../../../components/layout/Loading";
import useEditKpiGroupStore from "./editKpiGroupStore";

type KpiFormValues = {
  title: string;
  openDataPath: string;
  mostraAndamento: boolean;
  direzioneAndamento: string;
  valoreAndamento: string;
  dettaglioAndamento: string;
  valore: string;
  coloreSfondo: string;
  prefissoValore: string;
  suffissoValore: string;
  percentuale: string;
  testoFooter: string;
};

const defaultValues: KpiFormValues = {
  title: "Progetti attivi",
  openDataPath: "pa_2026_od_progetti_attivi_antepromatore_totali.csv",
  mostraAndamento: false,
  direzioneAndamento: "(duplicate) (duplicate) (duplicate) (duplicate)",
  valoreAndamento: "13.4%",
  dettaglioAndamento: "11.18%",
  valore: "81070",
  coloreSfondo: "",
  prefissoValore: "",
  suffissoValore: "",
  percentuale: "",
  testoFooter: "",
};

function KpiForm({
  initialValues = {},
  onSubmit,
}: {
  initialValues?: Partial<KpiFormValues>;
  onSubmit?: (data: KpiFormValues) => void;
}) {
  const { register, handleSubmit, watch } = useForm<KpiFormValues>({
    defaultValues: {
      ...defaultValues,
      ...initialValues,
    },
  });

  const mostraAndamento = watch("mostraAndamento");

  const onSubmitHandler = (data: KpiFormValues) => {
    console.log(data);
    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="w-full">
      <div className="">
        <div className="">
          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title*
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("title")}
              />
            </div>

            {/* Open Data Path */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Open Data Path
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                {...register("openDataPath")}
              />
            </div>

            {/* Info aggiuntive */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Info aggiuntive
              </h3>

              {/* Mostra andamento */}
              <div className="mb-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      {...register("mostraAndamento")}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-colors"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Mostra andamento
                  </span>
                </label>
              </div>

              {/* Direzione andamento */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Direzione andamento
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 text-sm"
                  {...register("direzioneAndamento")}
                  disabled={!mostraAndamento}
                />
              </div>

              {/* Valore andamento */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valore andamento
                </label>
                <input
                  type="text"
                  disabled={!mostraAndamento}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                  {...register("valoreAndamento")}
                />
              </div>

              {/* Dettaglio andamento */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dettaglio andamento
                </label>
                <input
                  type="text"
                  disabled={!mostraAndamento}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                  {...register("dettaglioAndamento")}
                />
              </div>
            </div>

            {/* Altri campi */}
            <div className="space-y-4 border-t pt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valore
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("valore")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Colore sfondo
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("coloreSfondo")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prefisso valore
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("prefissoValore")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Suffisso valore
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("suffissoValore")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Percentuale
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("percentuale")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Testo footer
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("testoFooter")}
                />
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Salva
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

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

  function saveKpiHandler(data: KpiFormValues) {
    //update store with new kpi
    console.log("KPI data to save:", data);
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
            <KpiForm onSubmit={saveKpiHandler} />
          </Dialog>
        )}
      </div>
    </Layout>
  );
}

export default EditKpiGroup;
