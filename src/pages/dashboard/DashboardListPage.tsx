import { useEffect, useState } from 'react';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { useNavigate } from 'react-router-dom';
import DashboardList from '../../components/dashboard/DashboardList';
import Layout from '../../components/layout';
import ConfirmDialog from '../../components/layout/ConfirmDialog';
import GenericDialog from '../../components/layout/GenericDialog';
import Loading from '../../components/layout/Loading';
import * as api from '../../lib/dashaboard-api';
import useDashboardsStoreState from '../../lib/dashboardListStore';
import { FieldDataType } from '../../types';

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

  const navigate = useNavigate();

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
    const item = list.find((l) => l.id === id);
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
      <PanelGroup direction='horizontal' className='w-full'>
        <Panel defaultSize={30} minSize={20} className='bg-base-100'>
          <div className='p-4'>
            <div>
              {loading ? (
                <Loading />
              ) : (
                <>
                  <h4 className='text-4xl font-bold'>
                    {list && list.length ? 'My Dashboards' : 'Welcome'}
                  </h4>
                  <div>
                    <div className='flex my-5 gap-4'>
                      <div
                        className='btn btn-primary'
                        onClick={createClickHandler}
                      >
                        + Aggiungi dashboard
                      </div>
                    </div>
                  </div>
                  <DashboardList
                    list={list}
                    handleDeleteDashboard={deleteClickHandler}
                    handleEditDashboard={(item) => {
                      editClickHandler(item.id ?? '');
                    }}
                    handleViewDashboard={viewClickHandler}
                  ></DashboardList>
                </>
              )}
            </div>
            {showCreateModal && (
              <GenericDialog
                toggle={showCreateModal}
                title='Aggiungi Dashboard'
                labels={{ confirm: 'Aggiungi', cancel: 'Annulla' }}
                confirmCb={() => {
                  if (!newDashboard) {
                    return;
                  }
                  createModalConfirmHandler(newDashboard);
                }}
                cancelCb={() => {
                  createModalCancelHandler();
                }}
              >
                <div className='bg-base-200'>
                  <div className='p-4 my-5'>
                    <label className='name'>Nome</label>
                    <input
                      className='input w-full'
                      type='text'
                      name='name'
                      onChange={(e) => {
                        const name = e.target.value;
                        const oldValue =
                          newDashboard ??
                          ({} as { name: string; description: string });
                        setNewDashboard({ ...oldValue, name });
                      }}
                    />
                  </div>
                  <div className='p-4 my-5'>
                    <label className='name'>Descrizione</label>
                    <input
                      className='input w-full'
                      type='text'
                      name='description'
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
                title='Cancellazione Dashboard'
                message={`Vuoi cancellare la dashboard ${selectedItem?.name}?`}
                confirmCb={dialogConfirmModalHandler}
                cancelCb={dialogCancelModalHandler}
              ></ConfirmDialog>
            )}
          </div>
        </Panel>
      </PanelGroup>
    </Layout>
  );
}

export default DashboardsPage;
