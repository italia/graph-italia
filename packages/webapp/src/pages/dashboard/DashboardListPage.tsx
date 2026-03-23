import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { FieldDataType } from "../../types";

import DashboardTable from "../../components/DashboardTable";
import Layout from "../../components/layout";
import ConfirmDialog from "../../components/layout/ConfirmDialog";
import GenericDialog from "../../components/layout/GenericDialog";
import Loading from "../../components/layout/Loading";
import * as api from "../../lib/api";
import useDashboardsStoreState from "../../lib/dashboardListStore";

function DashboardsPage() {
  const { list, setList } = useDashboardsStoreState((state) => state);

  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newDashboard, setNewDashboard] = useState<{
    name: string;
    description: string;
  }>();
  const [selectedItem, setSelectedItem] = useState<FieldDataType>();
  const navigate = useNavigate();

  async function fetchDashboards() {
    setLoading(true);
    try {
      const data = await api.getDashboards();
      setList(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function createDashboard(payload: {
    name: string;
    description: string;
  }) {
    return await api.createDashboard(payload);
  }

  function createClickHandler() {
    setShowCreateModal(true);
  }

  function editClickHandler(id: string) {
    navigateToEdit(id);
  }

  function viewClickHandler(id: string) {
    if (!id) {
      throw new Error();
    }
    navigate(`/dashboards/${id}/view`);
  }

  function deleteClickHandler(id: string) {
    const item = list.find((l: FieldDataType) => l.id === id);
    if (item) {
      setSelectedItem(item);
      setShowDeleteModal(true);
    }
  }

  async function dialogConfirmModalHandler() {
    if (!selectedItem) {
      return;
    }
    const { id } = selectedItem;
    if (id) {
      try {
        const data = await api.deleteDashaboard(id);
        if (data) {
          fetchDashboards();
        }
      } catch (error) {
        console.log(error);
      }
    }
    closeDeleteModal();
  }

  function dialogCancelModalHandler() {
    closeDeleteModal();
  }

  function closeDeleteModal() {
    setShowDeleteModal(false);
    setSelectedItem(undefined);
  }

  async function createModalConfirmHandler(payload: {
    name: string;
    description: string;
  }) {
    const response = await createDashboard(payload);
    if (!response) {
      return;
    }
    const { id } = response;
    closeCreateModal();
    setNewDashboard(undefined);
    navigateToEdit(id);
  }

  function createModalCancelHandler() {
    closeCreateModal();
  }

  function closeCreateModal() {
    setShowCreateModal(false);
  }

  function navigateToEdit(id?: string) {
    if (!id) {
      throw new Error();
    }
    navigate(`/dashboards/${id}/edit`);
  }

  useEffect(() => {
    // window.location.href = '/login';
    fetchDashboards();
  }, []);

  return (
    <Layout>
      <div className="p-4">
        {loading ? (
          <Loading />
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <h4 className="text-4xl font-bold">
                {list?.length ? "My Dashboards" : "Welcome"}
              </h4>
              <button
                type="button"
                className="btn btn-primary"
                onClick={createClickHandler}
              >
                + Create dashboard
              </button>
            </div>
            <DashboardTable
              list={list}
              handleDeleteDashboard={deleteClickHandler}
              handleEditDashboard={(item) => editClickHandler(item.id ?? "")}
              handleViewDashboard={viewClickHandler}
            />
          </>
        )}
        {showCreateModal && (
          <GenericDialog
            toggle={showCreateModal}
            title="Aggiungi Dashboard"
            labels={{ confirm: "Aggiungi", cancel: "Annulla" }}
            confirmCb={() => {
              if (!newDashboard) return;
              createModalConfirmHandler(newDashboard);
            }}
            cancelCb={createModalCancelHandler}
          >
            <div className="bg-base-200">
              <div className="p-4 my-5">
                <label htmlFor="dashboard_name" className="name">Nome</label>
                <input
                  id="dashboard_name"
                  className="input w-full"
                  type="text"
                  name="name"
                  onChange={(e) => {
                    const name = e.target.value;
                    const oldValue =
                      newDashboard ??
                      ({} as { name: string; description: string });
                    setNewDashboard({ ...oldValue, name });
                  }}
                />
              </div>
              <div className="p-4 my-5">
                <label htmlFor="dashboard_description" className="name">Descrizione</label>
                <input
                  id="dashboard_description"
                  className="input w-full"
                  type="text"
                  name="description"
                  onChange={(e) => {
                    const description = e.target.value;
                    const oldValue =
                      newDashboard ??
                      ({} as { name: string; description: string });
                    setNewDashboard({ ...oldValue, description });
                  }}
                />
              </div>
            </div>
          </GenericDialog>
        )}
        {showDeleteModal && (
          <ConfirmDialog
            toggle={showDeleteModal}
            title="Cancellazione Dashboard"
            message={`Vuoi cancellare la dashboard ${selectedItem?.name}?`}
            confirmCb={dialogConfirmModalHandler}
            cancelCb={dialogCancelModalHandler}
          />
        )}
      </div>
    </Layout>
  );
}

export default DashboardsPage;
