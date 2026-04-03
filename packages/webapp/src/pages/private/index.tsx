import { useMachine } from "@xstate/react";
import { type FieldDataType } from "dataviz-components";
import { useEffect, useState } from "react";
import { FaChartBar, FaList, FaMap, FaRegSquare } from "react-icons/fa6";



import Layout from "../../components/layout/index.tsx";
// import RenderChart from "../components/RenderChart";
import Loading from "../../components/layout/Loading.tsx";

import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ChartTable from "../../components/ChartTable.tsx";
import DashboardTable from "../../components/DashboardTable.tsx";
import GenericDialog from "../../components/layout/GenericDialog.tsx";
import * as api from "../../lib/api.ts";
import useChartsStoreState from "../../lib/chartListStore.ts";
import useDashboardsStoreState from "../../lib/dashboardListStore.ts";
import stepMachine from "../../lib/stepMachine.ts";
import useStoreState from "../../lib/storeState.ts";
import { ROUTES } from "../../router.tsx";

function Home() {
  const { t } = useTranslation("pages", { keyPrefix: "home" });
  const [state, send] = useMachine(stepMachine);
  const { loadItem } = useStoreState((state) => state);

  const { list, setList } = useChartsStoreState((state) => state);
  const { list: dashboardList, setList: setDashboardList } =
    useDashboardsStoreState((state) => state);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [isCreatingNewChart, setIsCreatingNewChart] = useState<number>(0);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [pendingDeleteDashboardId, setPendingDeleteDashboardId] = useState<
    string | null
  >(null);
  const [showCreateNewDialog, setShowCreateNewDialog] = useState(false);
  const [showCreateProjectDialog, setShowCreateProjectDialog] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [showRenameProjectDialog, setShowRenameProjectDialog] = useState(false);
  const [projectToRename, setProjectToRename] = useState<api.Project | null>(null);
  const [renameProjectName, setRenameProjectName] = useState("");
  const [isRenamingProject, setIsRenamingProject] = useState(false);



  async function fetchDashboards() {
    setDashboardLoading(true);
    try {
      const data = await api.getDashboards();
      setDashboardList(data);
    } catch (error) {
      console.error(error);
    } finally {
      setDashboardLoading(false);
    }
  }

  async function fetchCharts() {
    setLoading(true);
    try {
      const data = await api.getCharts();
      setList(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchProjects() {
    try {
      const data = await api.getProjects();
      setProjects(data);
      // If no project selected, select the first one (or server will fallback to default)
      if (!currentProjectId && data.length > 0) {
        // We don't necessarily need to set it here because the server handles default,
        // but it's good for UI consistency
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  }

  useEffect(() => {
    fetchProjects();
    fetchCharts();
    fetchDashboards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProjectId]);

  const handleCreateProject = async () => {
    if (!newProjectName) return;
    setIsCreatingProject(true);
    try {
      const project = await api.createProject({ name: newProjectName });
      if (project) {
        await fetchProjects();
        setCurrentProjectId(project.id);
        setShowCreateProjectDialog(false);
        setNewProjectName("");
      }
    } catch (error) {
      console.error("Failed to create project:", error);
    } finally {
      setIsCreatingProject(false);
    }
  };

  const handleRenameProject = async () => {
    if (!projectToRename || !renameProjectName) return;
    setIsRenamingProject(true);
    try {
      await api.updateProject(projectToRename.id, { name: renameProjectName });
      await fetchProjects();
      setShowRenameProjectDialog(false);
      setProjectToRename(null);
      setRenameProjectName("");
    } catch (error) {
      console.error("Failed to rename project:", error);
    } finally {
      setIsRenamingProject(false);
    }
  };

  const handleSelectProject = (projectId: string) => {
    setCurrentProjectId(projectId);
    // Force blur any active element to close DaisyUI dropdowns
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const personalProjects = projects.filter(p => !p.orgs || p.orgs.length === 0);
  const orgsWithProjects: Record<string, { name: string; projects: api.Project[] }> = {};

  projects.forEach(p => {
    p.orgs?.forEach(o => {
      if (!orgsWithProjects[o.org.id]) {
        orgsWithProjects[o.org.id] = { name: o.org.name, projects: [] };
      }
      orgsWithProjects[o.org.id].projects.push(p);
    });
  });




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

  type ItemTypeNames = "chart" | "kpi" | "map" | "dash";

  function navigateToEdit(key: ItemTypeNames, id: string) {
    if (!id) throw new Error("Missing ID");
    switch (key) {
      case "dash":
        return navigate(ROUTES.editDashboard(id));
      case "kpi":
        return navigate(ROUTES.editKpi(id));
      case "map":
        return navigate(ROUTES.editMap(id));
      default:
        return navigate(ROUTES.editChart(id));
    }
  }

  function generateName(key: string) {
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .slice(0, 19);
    return `${key}-${timestamp}`;
  }

  const itemTypes = [
    {
      id: 1,
      key: "chart",
      label: "Chart",
      icon: <FaChartBar size={24} aria-hidden="true" />,
    },
    {
      id: 2,
      key: "kpi",
      label: "KPI Group",
      icon: <FaList size={24} aria-hidden="true" />,
    },
    {
      id: 3,
      key: "map",
      label: "Map",
      icon: <FaMap size={24} aria-hidden="true" />,
    },
    {
      id: 4,
      key: "dash",
      label: "Dashboard",
      icon: <FaRegSquare size={24} aria-hidden="true" />,
    },
  ];

  async function handleCreateFromDialog(id: number, key: ItemTypeNames) {
    const name = generateName(key);
    setIsCreatingNewChart(id);
    let response = undefined;
    try {
      // const response = await api.createChart({ name });
      switch (key) {
        case "kpi":
          response = await api.createKpiGroup({ name, chart: "kpi" });
          break;
        case "dash":
          response = await api.createDashboard({ name });
          break;
        default:
          response = await api.createChart({
            name,
            chart: key === "chart" ? "bar" : key === "map" ? "cmap" : key,
          });
          break;
      }
      if (!response) return;
      setShowCreateNewDialog(false);
      navigateToEdit(key, response.id);
    } catch (error) {
      console.error(`Error creating ${key} :`, error);
      setIsCreatingNewChart(0);
    }
  }

  return (
    <Layout>
      <Helmet>
        <title>{t(`header.title`)}</title>
        <meta name="description" content={t(`head.meta.description.content`)} />
      </Helmet>
      <div className="w-full flex justify-between items-center gap-4 bg-base-300 py-4 px-8 rounded-lg mb-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">{t(`header.title`)}</h1>
          {/* Project Switcher */}
          <div className="flex items-center gap-2 mt-1">
            <div className="dropdown dropdown-bottom">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-xs normal-case gap-2 px-1 opacity-70 hover:opacity-100">
                <FaFolderOpen className="text-secondary" />
                <span className="max-w-[200px] truncate">
                  {projects.find(p => p.id === currentProjectId)?.name || t("projectSwitcher.selectPrompt", "Select Project")}
                </span>
                <FaChevronDown className="w-3 h-3" />
              </div>
              <ul tabIndex={0} className="dropdown-content z-[20] menu p-2 shadow bg-base-200 rounded-box w-64 border border-base-300 mt-1 max-h-[400px] overflow-y-auto">
                {personalProjects.length > 0 && (
                  <>
                    <li className="menu-title text-[10px] uppercase opacity-50 font-bold">{t("projectSwitcher.personal", "Personal Projects")}</li>
                    {personalProjects.map(project => (
                      <li key={project.id}>
                        <div className="flex items-center justify-between gap-1 group">
                          <button
                            className={`flex-grow text-left ${currentProjectId === project.id ? "active" : ""}`}
                            onClick={() => handleSelectProject(project.id)}
                          >
                            {project.name}
                          </button>
                          <button
                            className="btn btn-ghost btn-xs opacity-0 group-hover:opacity-100 px-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              setProjectToRename(project);
                              setRenameProjectName(project.name);
                              setShowRenameProjectDialog(true);
                            }}
                          >
                            <FaPencil className="w-3 h-3" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </>
                )}

                {Object.entries(orgsWithProjects).map(([orgId, orgData]) => (
                  <div key={orgId}>
                    <div className="divider my-0 opacity-20"></div>
                    <li className="menu-title text-[10px] uppercase opacity-50 font-bold">{orgData.name}</li>
                    {orgData.projects.map(project => (
                      <li key={project.id}>
                        <div className="flex items-center justify-between gap-1 group">
                          <button
                            className={`flex-grow text-left ${currentProjectId === project.id ? "active" : ""}`}
                            onClick={() => handleSelectProject(project.id)}
                          >
                            {project.name}
                          </button>
                          {/* Only allow renaming if owner (implicitly checked by server but UI feedback is good) */}
                          <button
                            className="btn btn-ghost btn-xs opacity-0 group-hover:opacity-100 px-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              setProjectToRename(project);
                              setRenameProjectName(project.name);
                              setShowRenameProjectDialog(true);
                            }}
                          >
                            <FaPencil className="w-3 h-3" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </div>
                ))}

                <div className="divider my-1"></div>
                <li>
                  <button onClick={() => {
                    setShowCreateProjectDialog(true);
                    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
                  }} className="text-primary gap-2">
                    <FaFolderPlus /> {t("projectSwitcher.newBtn", "New Project")}
                  </button>
                </li>
              </ul>


            </div>
          </div>
        </div>
        <div className="flex-shrink-0">
          <div className="flex my-5 gap-4">
            {!loading && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setShowCreateNewDialog(true)}
              >
                + {t(`body.actions.createNew.label`)}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <Loading />
        ) : (
          <>
            <div className="card border border-base-200 bg-base-100 shadow-md p-4 mb-6">
              <h3 className="text-lg mb-4 font-semibold">
                {t(`header.${list && list.length ? "charts" : "noCharts"}`)}
              </h3>

              <div>
                <ChartTable
                  list={list as FieldDataType[]}
                  handleLoadChart={handleLoadChart}
                  handleDeleteChart={handleDeleteChart}
                />
              </div>
            </div>
            <div className="card border border-base-200 bg-base-100 shadow-md p-4 mb-6">
              <div className="mt-10">
                <h3 className="text-lg mb-4 font-semibold">
                  {t(
                    `header.${dashboardList && dashboardList.length ? "dashboards" : "noDashboards"}`,
                  )}
                </h3>
                {dashboardLoading ? (
                  <Loading />
                ) : (
                  <DashboardTable
                    list={dashboardList ?? []}
                    handleDeleteDashboard={(id) =>
                      setPendingDeleteDashboardId(id)
                    }
                    handleEditDashboard={(item) =>
                      navigate(ROUTES.editDashboard(item.id ?? ""))
                    }
                    handleViewDashboard={(id) =>
                      navigate(ROUTES.viewDashboard(id))
                    }
                  />
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Create New dialog */}
      <GenericDialog
        toggle={showCreateNewDialog}
        title={t(`modals.createNew.title`)}
        description={t(`modals.createNew.description`)}
        labels={{
          cancel: t(`modals.createNew.labels.cancel`),
          confirm: t(`modals.createNew.labels.confirm`),
        }}
        cancelCb={() => {
          setShowCreateNewDialog(false);
          setIsCreatingNewChart(0);
        }}
      >
        <div className="grid grid-cols-2 gap-4 py-2">
          {itemTypes.map(({ key, id, icon, label }) => (
            <button
              key={key}
              type="button"
              className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-base-300 hover:border-primary hover:bg-base-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isCreatingNewChart < 1 ? false : true}
              onClick={() => handleCreateFromDialog(id, key as ItemTypeNames)}
            >
              {isCreatingNewChart === id ? (
                <span className="loading loading-spinner loading-md" />
              ) : (
                <span className="">{icon}</span>
              )}
              <span className="font-semibold">
                {isCreatingNewChart === 1 ? "Creating..." : label}
              </span>
            </button>
          ))}
        </div>
      </GenericDialog>

      {/* Create Project Dialog */}
      <GenericDialog
        toggle={showCreateProjectDialog}
        title={t("modals.createProject.title", "Create New Project")}
        description={t("modals.createProject.description", "Projects help you organize your charts and dashboards.")}
        labels={{ cancel: t("modals.cancel"), confirm: t("modals.createProject.confirm", "Create Project") }}
        confirmCb={handleCreateProject}
        cancelCb={() => setShowCreateProjectDialog(false)}
      >
        <div className="form-control w-full py-2">
          <label className="label">
            <span className="label-text font-semibold">{t("modals.createProject.form.name.label", "Project Name")}</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder={t("modals.createProject.form.name.placeholder", "E.g. Marketing Dashboard")}
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            autoFocus
          />

          {isCreatingProject && (
            <div className="flex justify-center mt-4">
              <span className="loading loading-spinner"></span>
            </div>
          )}
        </div>
      </GenericDialog>

      {/* Rename Project Dialog */}

      <GenericDialog
        toggle={showRenameProjectDialog}
        title={t("modals.renameProject.title", "Rename Project")}
        description={t("modals.renameProject.description", "Enter a new name for this project.")}
        labels={{ cancel: t("modals.cancel"), confirm: t("modals.renameProject.confirm", "Rename") }}
        confirmCb={handleRenameProject}
        cancelCb={() => setShowRenameProjectDialog(false)}
      >
        <div className="form-control w-full py-2">
          <label className="label">
            <span className="label-text font-semibold">{t("modals.renameProject.form.name.label", "Project Name")}</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={renameProjectName}
            onChange={(e) => setRenameProjectName(e.target.value)}
            autoFocus
          />
          {isRenamingProject && (
            <div className="flex justify-center mt-4">
              <span className="loading loading-spinner"></span>
            </div>
          )}
        </div>
      </GenericDialog>


      <GenericDialog
        toggle={!!pendingDeleteId}
        title={t(`body.confirms.deleteChart.label`)}
        description="This action cannot be undone."
        labels={{ cancel: t(`modals.cancel`), confirm: t(`modals.confirm`) }}
        confirmCb={confirmDeleteChart}
        cancelCb={() => setPendingDeleteId(null)}
      >
        <div></div>
      </GenericDialog>


      <GenericDialog
        toggle={!!pendingDeleteDashboardId}
        title="Delete Dashboard"
        description="This action cannot be undone."
        labels={{ cancel: t(`modals.cancel`), confirm: t(`modals.confirm`) }}
        confirmCb={() => {
          if (!pendingDeleteDashboardId) return;
          api
            .deleteDashaboard(pendingDeleteDashboardId)
            .then(() => fetchDashboards())
            .finally(() => setPendingDeleteDashboardId(null));
        }}
        cancelCb={() => setPendingDeleteDashboardId(null)}
      >
        <div></div>
      </GenericDialog>
    </Layout>
  );
}

export default Home;
