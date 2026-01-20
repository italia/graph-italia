import { RenderChart } from "dataviz-components";
import { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../components/layout";
import GenericDialog from "../../../components/layout/GenericDialog";
import Loading from "../../../components/layout/Loading";
import { useConfirmNavigation } from "../../../hooks/use-confirm-navigation";
import {
  KpiConfigForm,
  KpiDropdown,
  KpiGroupForm,
  KpiGroupFormValues,
  type KpiConfigFormHandle,
} from "./components";
import useEditKpiGroupStore from "./store";

function EditKpiGroup() {
  const { id } = useParams();
  const kpiConfigFormRef = useRef<KpiConfigFormHandle>(null);
  const {
    load,
    reload,
    save,
    showAddKpiFormModal,
    showEditKpiFormModal,
    addKpi,
    updateKpi,
    closeKpiGroupFormModal,
    showConfigFormModal,
    closeConfigFormModal,
    closeEditKpiFormModal,
    cancelDeleteModal,
    confirmDeleteModal,
    showDeleteKpiModal,
    deleteModalVisible,
    configModalVisible,
    kpiGroupFormModalVisible,
    editKpiGroupFormModalVisible,
    selectedKpi,
    vm,
    kpiGroup,
    isLoading,
    loaded,
    error,
    pendingChanges,
  } = useEditKpiGroupStore();

  const {
    showModal: showConfirmNavigationModal,
    confirm: confirmNavigationModal,
    cancel: cancelNavigationModal,
  } = useConfirmNavigation(pendingChanges);

  function changeConfigHandler() {
    showConfigFormModal();
  }

  function addKpiHandler() {
    showAddKpiFormModal();
  }

  function editKpiHandler(index: number) {
    showEditKpiFormModal(index);
  }

  function deleteKpiHandler(index: number) {
    showDeleteKpiModal(index);
  }

  function saveKpiHandler(data: KpiGroupFormValues) {
    //update store with new kpi
    console.log("KPI data to save:", data);
    addKpi(data);
    //close form modal
    closeKpiGroupFormModal();
  }

  function updateKpiHandler(data: KpiGroupFormValues) {
    updateKpi(data);
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
            <button onClick={resetHandler} className="btn btn-danger">
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
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold">{vm.name}</h1>
                <h4 className="text-xl">{vm.description}</h4>
              </div>
              <div>
                <button
                  className="btn btn-secondary mr-4"
                  onClick={changeConfigHandler}
                >
                  Cambia configurazione
                </button>
                <button className="btn btn-primary" onClick={addKpiHandler}>
                  Aggiungi KPI +
                </button>
              </div>
            </div>
            <div className="flex flex-wrap items-center">
              {kpiGroup.dataSource.map(
                (
                  ds: {
                    title: string;
                  },
                  index: number,
                ) => (
                  <div key={`${ds.title}-${index}`} className="flex my-4 gap-4">
                    <KpiDropdown
                      title={ds.title}
                      onEdit={() => editKpiHandler(index)}
                      onDelete={() => deleteKpiHandler(index)}
                    />
                  </div>
                ),
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
        {kpiGroupFormModalVisible && (
          <GenericDialog
            toggle={kpiGroupFormModalVisible}
            title="Nuovo KPI Group"
            confirmCb={() => {
              document
                .getElementById("kpi-group-form")
                ?.dispatchEvent(
                  new Event("submit", { cancelable: true, bubbles: true }),
                );
            }}
            cancelCb={() => {
              closeKpiGroupFormModal();
            }}
          >
            <KpiGroupForm onSubmit={saveKpiHandler} />
          </GenericDialog>
        )}
        {editKpiGroupFormModalVisible && (
          <GenericDialog
            toggle={editKpiGroupFormModalVisible}
            title="Modifica KPI Group"
            confirmCb={() => {
              document
                .getElementById("kpi-group-form")
                ?.dispatchEvent(
                  new Event("submit", { cancelable: true, bubbles: true }),
                );
            }}
            cancelCb={() => {
              closeEditKpiFormModal();
            }}
          >
            <KpiGroupForm
              onSubmit={updateKpiHandler}
              initialValues={selectedKpi}
            />
          </GenericDialog>
        )}
        {configModalVisible && (
          <GenericDialog
            toggle={configModalVisible}
            title="Configurazione KPI Group"
            confirmCb={() => {
              const formData = kpiConfigFormRef.current?.getFormData();
              console.log("Configurazione KPI Group:", formData);
              closeConfigFormModal(formData);
            }}
            cancelCb={() => {
              closeConfigFormModal();
            }}
          >
            <KpiConfigForm ref={kpiConfigFormRef} config={kpiGroup.config} />
          </GenericDialog>
        )}
        ,
        {deleteModalVisible && (
          <GenericDialog
            toggle={deleteModalVisible}
            title="Conferma cancellazione"
            confirmCb={confirmDeleteModal}
            cancelCb={cancelDeleteModal}
          >
            <p>Sei sicuro di voler cancellare il KPI {selectedKpi?.title}</p>
          </GenericDialog>
        )}
        {showConfirmNavigationModal && (
          <GenericDialog
            toggle={showConfirmNavigationModal}
            title="Conferma navigazione"
            confirmCb={confirmNavigationModal}
            cancelCb={cancelNavigationModal}
          >
            <p>Sei sicuro di voler uscire senza salvare le modifiche?</p>
          </GenericDialog>
        )}
      </div>
    </Layout>
  );
}

export default EditKpiGroup;
