import { useMachine } from "@xstate/react";
import type { ChartColorScheme } from "graph-italia-components";
import {
  ColorSchemeProvider,
  RenderChart,
  type MatrixType,
} from "graph-italia-components";
import "graph-italia-components/dist/style.css";
import dayjs from "dayjs";
import { Helmet } from "react-helmet";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { FaCog, FaDatabase, FaInfo } from "react-icons/fa";
import { FaPen } from "react-icons/fa6";
import { startTransition, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { HOME_ROUTE, ROUTES } from "../../router.tsx";
import { useSettingsStore } from "../../lib/store/settings_store.ts";
import ChartOptions from "../../components/ChartOptions.tsx";
import Layout from "../../components/layout/index.tsx";
import EditStepsSidebar from "../../components/layout/EditStepsSidebar.tsx";
import Loading from "../../components/layout/Loading.tsx";
import NewTabLink from "../../components/layout/NewTabLink.tsx";
import SelectChart from "../../components/SelectChart.tsx";
import ChooseLoader from "../../components/load-data/ChooseLoader.tsx";
import SeriesSelector from "../../components/load-data/SeriesSelector.tsx";
import EditStepComponent, { type EditStepStatus } from "../../components/EditStepComponent.tsx";
import { useUnsavedChanges } from "../../hooks/useUnsavedChanges.tsx";
import TransformDataTable from "../../components/load-data/TransformDataTable.tsx";
import ThemeSwitcherComponent from "../../components/layout/ThemeSwitcher.tsx";
import { defaultConfig } from "../../lib/constants.ts";
import type { DataTransformRecipe } from "../../types.ts";
import stepMachine from "../../lib/stepMachine.ts";
import * as api from "../../lib/api.ts";
import useStoreState from "../../lib/store/storeState.ts";
import { useChartA11yProps } from "../../hooks/useChartA11yProps";


function EditChartPage() {
  const chartA11y = useChartA11yProps();
  const { t } = useTranslation("pages", {
    keyPrefix: `charts.editChart`,
  });
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const [state, send] = useMachine(stepMachine);
  const {
    id,
    chart,
    config,
    data,
    isRemote,
    remoteUrl,
    dataSource,
    setConfig,
    setChart,
    setData,
    setRemoteUrl,
    setIsRemote,
    loadItem,
    resetItem,
  } = useStoreState((state) => state);

  const [currentData, setCurrentData] = useState(null as any);
  const [loading, setLoading] = useState(true);
  const [chartName, setChartName] = useState<string>("");
  const [chartDescription, setChartDescription] = useState<string>("");
  const [chartPublish, setChartPublish] = useState<boolean>(api.isPublishingEnabled());
  // Recipe from SeriesSelector (column selection + aggregation): persisted in
  // config so the server can replay it when refreshing remote-linked data
  const [dataTransform, setDataTransform] = useState<DataTransformRecipe | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { settings } = useSettingsStore();
  const [previewScheme, setPreviewScheme] = useState<ChartColorScheme>(
    settings?.preferredTheme === "dark" ? "dark" : "light",
  );

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>("");
  // Announces step transitions to assistive tech (WCAG 1.3.2 / 3.3.2)
  const [stepAnnouncement, setStepAnnouncement] = useState<string>("");
  const seriesSelectorRef = useRef<HTMLDivElement>(null);
  const configurationHeadingRef = useRef<HTMLHeadingElement>(null);
  // Below xl the step column is a modal drawer: the rest of the page is
  // inert while it is open (#122)
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Inline title editing next to the preview heading (#59)
  const [editingTitle, setEditingTitle] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const editTitleButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (editingTitle) titleInputRef.current?.focus();
  }, [editingTitle]);
  useUnsavedChanges(hasUnsavedChanges, t(`unsavedChanges`));

  // After the initial load completes, reset any dirty flag that child components
  // may have set during their mount/initialization (e.g. SelectChart, ChartOptions
  // calling their setter props to apply defaults).
  useEffect(() => {
    if (!loading) {
      setHasUnsavedChanges(false);
    }
  }, [loading]);

  // Load existing chart when there's a paramId
  useEffect(() => {
    async function loadExistingChart() {
      if (paramId) {
        setLoading(true);
        try {
          const chartData = await api.getChart(paramId);
          if (chartData) {
            loadItem({
              ...chartData,
              id: paramId,
              config: chartData.config || defaultConfig,
            });
            setChartName(chartData.name || "");
            setChartDescription(chartData.description || "");
            setChartPublish(api.isPublishingEnabled() ? (chartData.publish ?? true) : false);
            setDataTransform(chartData.config?.dataTransform ?? null);

            // Go to config step only if chart already has data loaded
            const hasExistingData =
              chartData.data?.length > 0 || chartData.dataSource;
            if (hasExistingData) {
              send({ type: "CONFIG" });
            }
          }
        } catch (error) {
          console.error("Error loading chart:", error);
        } finally {
          setLoading(false);
        }
      } else {
        // Reset for new chart creation - clear any previous data
        resetItem();
        setChart("");
        setChartName("");
        setChartDescription("");
        setChartPublish(api.isPublishingEnabled());
        setLoading(false);
      }
    }
    loadExistingChart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramId]);

  const haveData = data && data[0].length > 0 ? true : dataSource ? true : false;
  const isConfigStep = state.matches("config");

  // Announce step transitions via aria-live so AT users learn that the next
  // interactive section is available, without forcibly moving keyboard focus.
  useEffect(() => {
    if (loading) return;
    if (isConfigStep) {
      setStepAnnouncement(t(`body.options.configuration.announcement`));
    } else if (currentData && !haveData) {
      setStepAnnouncement(t(`body.preview.seriesSelector.announcement`));
    }
  }, [isConfigStep, currentData, haveData, loading, t]);

  function handleUpload(d: any) {
    setHasUnsavedChanges(true);
    setCurrentData(d);
  }

  function handleSetRemoteData(d: any) {
    setHasUnsavedChanges(true);
    setIsRemote(true);
    setRemoteUrl(d.remoteUrl);
    setCurrentData(d.data);
  }


  // Generate default name based on chart type and date
  const getDefaultName = () => {
    return `${chart || "new"}chart-${dayjs(Date.now()).format(
      "YYYY-MM-DD_HH-mm",
    )}`;
  };

  // Save chart function; `exit` closes the flow and returns to the list (#77)
  async function saveChart(exit = false) {
    const finalName = chartName || getDefaultName();
    const payload = {
      name: finalName,
      description: chartDescription,
      publish: api.isPublishingEnabled() ? chartPublish : false,
      chart: chart || "bar",
      // ChartOptions rebuilds config from its form: merge the recipe at save
      // time so it can't be dropped along the way
      config: dataTransform ? { ...config, dataTransform } : config,
      data,
      isRemote,
      remoteUrl,
    };

    setIsSaving(true);
    setSaveStatus("");
    try {
      const result = await api.upsertChart(payload, paramId || id || "");
      if (result) {
        setHasUnsavedChanges(false);
        toast.success(t(`save.success.label`));
        setSaveStatus(t(`save.success.label`));
        // After creating a brand-new chart navigate to its permanent URL so that
        // every subsequent save issues PUT instead of POST.
        if (exit) {
          navigate(HOME_ROUTE);
          return;
        }
        if (!paramId && result.id) {
          navigate(ROUTES.editChart(result.id), { replace: true });
        }
      }
    } catch (error) {
      console.error("Error saving chart:", error);
      toast.error(t(`save.error.label`));
      setSaveStatus(t(`save.error.label`));
    } finally {
      setIsSaving(false);
    }
  }

  // Determine current step for display
  const getCurrentStepIndex = () => {
    if (state.matches("idle") || state.matches("input")) return 0;
    if (state.matches("config")) return 1;
    return 0;
  };

  // Check if Save button should be enabled
  const canSave = !!chart;

  const currentStepIndex = getCurrentStepIndex();

  // Vertical stepper: config phase means data is already loaded and confirmed
  const stepStatuses: [EditStepStatus, EditStepStatus, EditStepStatus] =
    currentStepIndex > 0
      ? ["completed", "completed", "active"]
      : ["completed", "active", "locked"];
  const stepStatusLabel = (s: EditStepStatus) =>
    t(`body.steps.status.${s}`, {
      defaultValue:
        s === "completed" ? "completato" : s === "active" ? "in corso" : "bloccato",
    });
  const stepConnector = (
    <div aria-hidden="true" className="w-px h-5 bg-base-300 ml-9" />
  );

  if (loading) {
    return (
      <Layout>
        <div className="p-6">
          <Loading />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>
          {t(`head.title.label`)}: {`${chartName ? ": " + chartName : ""}`}
        </title>
        <meta name="description" content={t(`head.meta.description.content`)} />
      </Helmet>
      {/* Live region for save status — announced without requiring focus (WCAG 4.1.3) */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {saveStatus}
      </div>
      {/* Live region for step-flow transitions (WCAG 1.3.2, 3.3.2) */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {stepAnnouncement}
      </div>
      {/* Toolbar stays visible while the configuration column scrolls, so
          "Salva" is always at hand (#76) */}
      <div
        className="sticky top-0 z-30 bg-base-200/95 backdrop-blur border-b border-base-300 w-full flex flex-wrap justify-between items-center gap-2 mb-2 py-4 px-4 lg:px-10"
        inert={sidebarOpen}
      >
        <button
          type="button"
          onClick={() => navigate(HOME_ROUTE)}
          className="btn btn-outline"
        >
          {t(`header.actions.back.label`)}
        </button>
        <h1 className="text-xl font-bold">
          {paramId
            ? t(`header.pageTitle.edit`)
            : t(`header.pageTitle.new`)}
        </h1>
        <div className="flex-shrink-0 flex gap-2">
          <button
            type="button"
            onClick={() => saveChart(false)}
            disabled={!hasUnsavedChanges || !canSave || isSaving}
            className="btn btn-primary gap-2"
          >
            {isSaving ? (
              <span role="status">
                <span className="loading loading-spinner loading-sm"></span>
                {t(`header.actions.save.isSaving`)}...
              </span>
            ) : (
              <> {t(`header.actions.save.default`)}</>
            )}
          </button>
          <button
            type="button"
            onClick={() => saveChart(true)}
            disabled={!hasUnsavedChanges || !canSave || isSaving}
            className="btn btn-outline btn-primary"
          >
            {t(`header.actions.saveAndExit.default`)}
          </button>
        </div>
      </div>

      <div className="mx-auto px-4 lg:px-10 pb-10">
        <div className="grid grid-cols-1 xl:grid-cols-6  gap-4">
          <EditStepsSidebar onOpenChange={setSidebarOpen}>
          <div className="xl:col-span-2">
            <EditStepComponent
              title={t(`body.options.setup.title`)}
              description={t(`body.options.setup.description`)}
              Icon={FaInfo}
              isOpen={false}
              isDisabled={false}
              index={0}
              stepNumber={1}
              status={stepStatuses[0]}
              srStatusLabel={stepStatusLabel(stepStatuses[0])}
            >
              <div className="pt-1">
                <div>
                  <div className="flex flex-col space-y-2">
                    {api.isPublishingEnabled() && (
                      <div className="flex items-center gap-4">
                        <input
                          id="chart_visibility"
                          type="checkbox"
                          role="switch"
                          checked={chartPublish}
                          aria-describedby="chart_visibility_state"
                          onChange={() => {
                            setHasUnsavedChanges(true);
                            setChartPublish(!chartPublish);
                          }}
                          className="toggle toggle-sm toggle-primary cursor-pointer"
                        />
                        <label
                          htmlFor="chart_visibility"
                          className="text-base text-base-content/70 cursor-pointer"
                        >
                          {t(`body.options.setup.form.fields.visibility.label`)}
                        </label>
                        <span
                          id="chart_visibility_state"
                          className="text-base text-base-content font-bold"
                        >
                          {t(
                            `body.options.setup.form.fields.visibility.values.${chartPublish ? "public" : "private"}`,
                          )}
                        </span>
                      </div>
                    )}
                    <label
                      htmlFor="chart_title"
                      className="mt-4 text-base-content/70"
                    >
                      {t(`body.options.setup.form.fields.title.label`)}
                    </label>
                    <input
                      id="chart_title"
                      type="text"
                      value={chartName}
                      onChange={(e) => {
                        setHasUnsavedChanges(true);
                        setChartName(e.target.value);
                      }}
                      placeholder={getDefaultName()}
                      className="input input-bordered py-2 px-3 w-full text-base bg-base-100 placeholder:text-base-content/40"
                    />
                    <label
                      htmlFor="chart_description"
                      className="mt-4 text-base-content/70"
                    >
                      {t(`body.options.setup.form.fields.description.label`)}
                    </label>
                    <textarea
                      id="chart_description"
                      value={chartDescription}
                      rows={3}
                      onChange={(e) => {
                        setHasUnsavedChanges(true);
                        setChartDescription(e.target.value);
                      }}
                      placeholder={t(
                        `body.options.setup.form.fields.description.placeholder`,
                      )}
                      className="input textarea input-bordered w-full text-base bg-base-100 placeholder:text-base-content/40"
                    />
                  </div>
                </div>
              </div>
            </EditStepComponent>

            {stepConnector}

            <EditStepComponent
              title={t(`body.options.data.title`)}
              description={t(`body.options.data.description`)}
              Icon={FaDatabase}
              isOpen={currentStepIndex === 0 ? true : false}
              isDisabled={false}
              index={1}
              stepNumber={2}
              status={stepStatuses[1]}
              srStatusLabel={stepStatusLabel(stepStatuses[1])}
            >
              {/* Step 2: Data loading */}
              <div className="pt-1">
                <ChooseLoader
                  handleUpload={handleUpload}
                  remoteUrl={remoteUrl}
                  handleSetRemoteData={handleSetRemoteData}
                />
              </div>
            </EditStepComponent>

            {stepConnector}

            <EditStepComponent
              title={t(`body.options.configuration.title`)}
              description={t(`body.options.configuration.description`)}
              Icon={FaCog}
              isOpen={currentStepIndex > 0 ? true : false}
              isDisabled={currentStepIndex === 0 ? true : false}
              index={2}
              stepNumber={3}
              status={stepStatuses[2]}
              srStatusLabel={stepStatusLabel(stepStatuses[2])}
              headingRef={configurationHeadingRef}
            >
              <div>
                {isConfigStep ? (
                  <div className="pt-1">
                    <SelectChart
                      setChart={(value: string) => {
                        setHasUnsavedChanges(true);
                        setChart(value);
                      }}
                      chart={chart}
                    />
                    <div className="divider my-2"></div>
                    <ChartOptions
                      config={config}
                      setConfig={(value) => {
                        setHasUnsavedChanges(true);
                        setConfig(value);
                      }}
                      chart={chart}
                      numSeries={(data as MatrixType)?.length - 1 || 0}
                    />
                  </div>
                ) : (
                  <div role="status">
                    {currentData && !haveData
                      ? t(`body.options.configuration.statusAwaitingSeries`)
                      : t(`body.options.configuration.status`)}
                  </div>
                )}
              </div>
            </EditStepComponent>
          </div>
          </EditStepsSidebar>

          {/* Right column: Preview */}
          <section
            aria-labelledby="chart-preview-heading"
            className="xl:col-span-4 flex flex-col p-4 lg:p-10 bg-base-100 border border-base-300 rounded-lg xl:sticky xl:top-24 xl:self-start xl:max-h-[calc(100vh-7rem)] xl:overflow-y-auto"
            inert={sidebarOpen}
          >
            <div className="bg-base-100 bl-2 flex flex-col gap-4 min-h-[500px]">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2
                    id="chart-preview-heading"
                    className="text-2xl font-bold"
                  >
                    {t(`header.preview.heading`)}
                    {chartName ? `: ${chartName}` : ""}
                  </h2>
                  {/* The title is edited where it is displayed (#59): the
                      field is the same one as in "Informazioni" */}
                  {editingTitle ? (
                    <span className="flex items-center gap-2">
                      <label htmlFor="chart_title_inline" className="sr-only">
                        {t(`body.options.setup.form.fields.title.label`)}
                      </label>
                      <input
                        id="chart_title_inline"
                        ref={titleInputRef}
                        type="text"
                        value={chartName}
                        placeholder={getDefaultName()}
                        onChange={(e) => {
                          setHasUnsavedChanges(true);
                          setChartName(e.target.value);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === "Escape") {
                            e.preventDefault();
                            setEditingTitle(false);
                            editTitleButtonRef.current?.focus();
                          }
                        }}
                        className="input input-bordered input-sm w-64 max-w-full text-base bg-base-100"
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={() => {
                          setEditingTitle(false);
                          editTitleButtonRef.current?.focus();
                        }}
                      >
                        {t(`header.preview.actions.editTitle.done`)}
                      </button>
                    </span>
                  ) : (
                    <button
                      ref={editTitleButtonRef}
                      type="button"
                      className="btn btn-sm btn-ghost gap-2"
                      onClick={() => setEditingTitle(true)}
                    >
                      <FaPen aria-hidden="true" />
                      {t(`header.preview.actions.editTitle.label`)}
                    </button>
                  )}
                </div>
                <div className="text-base-content/80">
                  {chartDescription ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: chartDescription.replace(/\n/g, "<br />"),
                      }}
                    />
                  ) : (
                    <p className="italic text-base-content">{""}</p>
                  )}
                </div>
              </div>

              <div>
                {state.matches("config") && chart ? (
                  <>
                    {api.isPublishingEnabled() && chartPublish && id && (
                      <div className="w-full flex flex-wrap items-center justify-end gap-3">
                        {hasUnsavedChanges ? (
                          <>
                            <span id="view-chart-hint" className="text-sm text-base-content/70">
                              {t(`header.preview.actions.viewChart.unsaved`)}
                            </span>
                            <button
                              type="button"
                              className="btn btn-outline"
                              disabled
                              aria-describedby="view-chart-hint"
                            >
                              {t(`header.preview.actions.viewChart.label`)}
                            </button>
                          </>
                        ) : (
                          <NewTabLink href={ROUTES.viewChart(id)} className="btn btn-outline">
                            {t(`header.preview.actions.viewChart.label`)}
                          </NewTabLink>
                        )}
                      </div>
                    )}
                    <ThemeSwitcherComponent
                      currentTheme={previewScheme}
                      handleChange={(value: ChartColorScheme) =>
                        setPreviewScheme(value)
                      }
                      contextLabel={t(`header.preview.heading`)}
                    />
                    <figure
                      role="figure"
                      aria-labelledby="chart-preview-heading"
                      aria-describedby="chart-preview-description"
                      className="overflow-auto min-h-[380px] relative rounded-lg m-0"
                      style={{
                        backgroundColor:
                          previewScheme === "dark" ? "#1a1a2e" : "#F5FAFF",
                      }}
                    >
                      <ColorSchemeProvider scheme={previewScheme}>
                        <RenderChart
                          id={id || paramId || "preview-map"}
                          chart={chart}
                          data={data}
                          config={config}
                          dataSource={null}
                          {...chartA11y}
                        />
                      </ColorSchemeProvider>
                      <figcaption
                        id="chart-preview-description"
                        className="sr-only"
                      >
                        {t(`body.preview.chartA11y`, {
                          type: chart,
                          name: chartName || t(`header.preview.untitled`),
                          description: chartDescription || "",
                          defaultValue: `Grafico di tipo {{type}}: {{name}}. {{description}}`,
                        })}
                        {" "}
                        <a href="#chart-data-table">
                          {t(`body.preview.dataTableLink`, { defaultValue: "Visualizza la tabella dati associata" })}
                        </a>
                      </figcaption>
                    </figure>
                  </>
                ) : (
                  <p className="italic text-base-content"></p>
                )}
              </div>
              <div>


                {!(haveData && data) ? (
                  <div>
                    <p className="italic text-base-content" role="status">
                      {t(`body.preview.loadDataMessage`)}
                    </p>
                    {currentData && (
                      <div
                        ref={seriesSelectorRef}
                        tabIndex={-1}
                        aria-labelledby="series-selector-heading"
                        className="card bg-base-100 shadow-sm border border-base-300"
                      >
                        <div className="card-body">
                          <h3
                            id="series-selector-heading"
                            className="text-lg font-semibold"
                          >
                            {t(`body.preview.seriesSelector.title`)}
                          </h3>
                          <p className="text-sm text-base-content/70">
                            {t(`body.preview.seriesSelector.description`)}
                          </p>
                          <SeriesSelector
                            initialData={currentData || data}
                            setData={(d, transform) => {
                              setData(d);
                              setDataTransform(transform ?? null);
                              setHasUnsavedChanges(true);
                              send({ type: "CONFIG" });
                            }}
                          />
                        </div>
                      </div>)}
                  </div>
                ) : (
                  <div id="chart-data-table" className="overflow-auto flex-1 min-h-0">
                    <TransformDataTable
                      currentData={(data)}
                      handleTransformData={(d) => {
                        startTransition(() => {
                          setData(d);
                          setHasUnsavedChanges(true);
                          setCurrentData(d);
                        });
                      }}
                      onReset={() => {
                        setData(null);
                        setCurrentData(null);
                        send({ type: "INPUT" });
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}

export default EditChartPage;
