import { useMachine } from "@xstate/react";
import type { ChartColorScheme } from "graph-italia-components";
import {
  ColorSchemeProvider,
  RenderChart,
} from "graph-italia-components";
import "graph-italia-components/dist/style.css";
import dayjs from "dayjs";
import { Helmet } from "react-helmet";
import toast from "../../lib/toast";
import { useTranslation } from "react-i18next";
import { FaCog, FaDatabase, FaInfo } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { HOME_ROUTE, ROUTES } from "../../router.tsx";
import { useSettingsStore } from "../../lib/store/settings_store.ts";

import Layout from "../../components/layout/index.tsx";
import NewTabLink from "../../components/layout/NewTabLink.tsx";
import EditStepsSidebar from "../../components/layout/EditStepsSidebar.tsx";
import Loading from "../../components/layout/Loading.tsx";
import EditStepComponent from "../../components/EditStepComponent.tsx";
import { useUnsavedChanges } from "../../hooks/useUnsavedChanges.tsx";
import GeoMapUpload from "../../components/load-data/GeoMapUpload.tsx";
import GeoSearch from "../../components/load-data/GeoSearch.tsx";
import ThemeSwitcherComponent from "../../components/layout/ThemeSwitcher.tsx";
import { defaultConfig } from "../../lib/constants.ts";
import stepMachine from "../../lib/stepMachine.ts";
import * as api from "../../lib/api.ts";
import useStoreState from "../../lib/store/storeState.ts";
import { useChartA11yProps } from "../../hooks/useChartA11yProps";


export default function EditMapPage() {
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
    setChart,
    setDataSource,
    loadItem,
    resetItem,
  } = useStoreState((state) => state);

  const [loading, setLoading] = useState(true);
  const [chartName, setChartName] = useState<string>("");
  const [chartDescription, setChartDescription] = useState<string>("");
  const [chartPublish, setChartPublish] = useState<boolean>(api.isPublishingEnabled());
  const [showDescription, setShowDescription] = useState(true);
  const descriptionMissing = chartDescription.trim().length === 0;
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const { settings } = useSettingsStore();
  const [previewScheme, setPreviewScheme] = useState<ChartColorScheme>(
    settings?.preferredTheme === "dark" ? "dark" : "light",
  );

  const [latField, setLatField] = useState("lat");
  const [lngField, setLngField] = useState("lng");

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  useUnsavedChanges(hasUnsavedChanges, t(`unsavedChanges`));

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
            setChart("cmap");
            setChartName(chartData.name || "");
            setChartDescription(chartData.description || "");
            setShowDescription(chartData.config?.showDescription !== false);
            setChartPublish(api.isPublishingEnabled() ? (chartData.publish ?? true) : false);

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
        setChart("cmap");
        setChartName("");
        setChartDescription("");
        setChartPublish(api.isPublishingEnabled());
        setLoading(false);
      }
    }
    loadExistingChart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramId]);

  const haveData = !!(dataSource && dataSource.length > 0);



  // Generate default name based on chart type and date
  const getDefaultName = () => {
    return `${chart || "new"}chart-${dayjs(Date.now()).format(
      "YYYY-MM-DD_HH-mm",
    )}`;
  };

  // Save chart function
  async function saveChart() {
    const finalName = chartName || getDefaultName();
    const payload = {
      name: finalName,
      description: chartDescription,
      publish: api.isPublishingEnabled() ? chartPublish : false,
      chart: chart || "cmap",
      config: { ...config, showDescription },
      data,
      dataSource,
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
  const canSave = !!chart && !descriptionMissing;

  const currentStepIndex = getCurrentStepIndex();

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
      {/* Save outcome announced without moving the focus (WCAG 4.1.3, #135) */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {saveStatus}
      </div>
      <Helmet>
        <title>
          {t(`head.mapTitle`)}{chartName ? `: ${chartName}` : ""}
        </title>
        <meta name="description" content={t(`head.meta.description.content`)} />
      </Helmet>
      <div className="sticky top-0 z-30 bg-base-200/95 backdrop-blur border-b border-base-300 w-full flex justify-between items-center gap-2 mb-2 py-4 px-4 lg:px-10">
        <button
          type="button"
          onClick={() => navigate(HOME_ROUTE)}
          className="btn btn-outline"
        >
          {t(`header.actions.back.label`)}
        </button>
        <h1 className="text-xl font-bold">
          {paramId
            ? t(`header.pageTitle.edit`, { defaultValue: "Modifica mappa" })
            : t(`header.pageTitle.new`, { defaultValue: "Nuova mappa" })}
        </h1>
        <div className="flex-shrink-0">
          <button
            type="button"
            onClick={saveChart}
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
        </div>
      </div>

      <div className="mx-auto px-4 lg:px-10 pb-10">
        <div className="grid grid-cols-1 xl:grid-cols-6  gap-4">
          <EditStepsSidebar>
          <div className="space-y-1">
            <EditStepComponent
              title={t(`body.options.setup.title`)}
              description={t(`body.options.setup.description`)}
              Icon={FaInfo}
              isOpen={true}
              isDisabled={false}
              index={0}
            >
              <div className="card bg-base-100 shadow-sm border border-base-300">
                <div className="card-body">
                  <div className="flex flex-col space-y-2">
                    {api.isPublishingEnabled() && (
                      <div className="flex items-center gap-4">
                        <input
                          id="chart_visibility"
                          type="checkbox"
                          checked={chartPublish}
                          onChange={() => {
                            setHasUnsavedChanges(true);
                            setChartPublish(!chartPublish);
                          }}
                          className="toggle toggle-sm toggle-primary cursor-pointer"
                        />
                        <label
                          htmlFor="chart_visibility"
                          className="text-sm text-base-content/70 cursor-pointer"
                        >
                          {t(`body.options.setup.form.fields.visibility.label`)}
                        </label>
                        <span className="text-sm text-base-content font-bold">
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
                      className="input input-bordered py-2 px-3 w-full bg-base-100 placeholder:text-base-content/65"
                    />
                    <label
                      htmlFor="chart_description"
                      className="mt-4 text-base-content/70"
                    >
                      {t(`body.options.setup.form.fields.description.label`)} *
                    </label>
                    <p id="chart_description_hint" className="text-sm text-base-content/70">
                      {t(`body.options.setup.form.fields.description.hint`)}
                    </p>
                    <textarea
                      id="chart_description"
                      value={chartDescription}
                      rows={3}
                      required
                      aria-required="true"
                      aria-invalid={descriptionMissing}
                      aria-describedby={descriptionMissing ? "chart_description_hint chart_description_error" : "chart_description_hint"}
                      onChange={(e) => {
                        setHasUnsavedChanges(true);
                        setChartDescription(e.target.value);
                      }}
                      placeholder={t(
                        `body.options.setup.form.fields.description.placeholder`,
                      )}
                      className={`input textarea input-bordered input-sm w-full bg-base-100 placeholder:text-base-content/65 ${descriptionMissing ? "textarea-error" : ""}`}
                    />
                    {descriptionMissing && (
                      <p id="chart_description_error" role="alert" className="text-sm text-error">
                        {t(`body.options.setup.form.fields.description.error`)}
                      </p>
                    )}
                    <div className="mt-4 flex items-center gap-4">
                      <input
                        id="chart_show_description"
                        type="checkbox"
                        role="switch"
                        checked={showDescription}
                        aria-describedby="chart_show_description_hint"
                        onChange={() => {
                          setHasUnsavedChanges(true);
                          setShowDescription((v) => !v);
                        }}
                        className="toggle toggle-sm toggle-primary cursor-pointer"
                      />
                      <label htmlFor="chart_show_description" className="text-base text-base-content/70 cursor-pointer">
                        {t(`body.options.setup.form.fields.showDescription.label`)}
                      </label>
                    </div>
                    <p id="chart_show_description_hint" className="text-sm text-base-content/70">
                      {t(`body.options.setup.form.fields.showDescription.hint`)}
                    </p>
                  </div>
                </div>
              </div>
            </EditStepComponent>

            <EditStepComponent
              title={t(`body.options.data.title`)}
              description={t(`body.options.data.description`)}
              Icon={FaDatabase}
              isOpen={currentStepIndex === 0 ? true : false}
              isDisabled={false}
              index={1}
            >
              {/* Step 1: Data loading */}
              <div className="card bg-base-100 shadow-sm border border-base-300">
                <div className="card-body">
                  <GeoMapUpload
                    setData={(d, meta) => {
                      setDataSource(d);
                      setLatField(meta.latField);
                      setLngField(meta.lngField);
                      setHasUnsavedChanges(true);
                      send({ type: "CONFIG" });
                    }}
                  />
                </div>
              </div>
            </EditStepComponent>

            <EditStepComponent
              title={t(`body.options.configuration.title`)}
              description={t(`body.options.configuration.description`)}
              Icon={FaCog}
              isOpen={currentStepIndex > 0 ? true : false}
              isDisabled={currentStepIndex === 0 ? true : false}
              index={2}
            >
              <div>
                {state.matches("config") ? (
                  <div className="card bg-base-100 shadow-sm border border-base-300">
                    <div className="card-body">
                      <div className="divider my-2" />
                      <div>
                        <ul>
                          here will be placed the configuration options for the map chart, such as:
                          <li>- map style  (which layer)</li>
                          <li> - marker type (circle, choropleth, etc)</li>
                          <li> - marker options (size, color, etc)</li>
                          <li>    - tooltip options (which fields to show, formatting, if enabled, etc)</li>
                          <li>- clustering options (if applicable, for point maps)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div role="status">
                    {t(`body.options.configuration.status`)}{" "}
                  </div>
                )}
              </div>
            </EditStepComponent>
          </div>
          </EditStepsSidebar>

          {/* Right column: Preview */}
          <section
            aria-labelledby="map-preview-heading"
            className="xl:col-span-4 flex flex-col h-full p-4 lg:p-10 bg-base-100  border border-base-300 rounded-lg"
          >
            <div className="bg-base-100 bl-2 flex flex-col gap-4 min-h-[500px]">
              <div>
                <h2
                  id="map-preview-heading"
                  className="text-2xl font-bold"
                >
                  {t(`header.preview.heading`, { defaultValue: "Anteprima" })}
                  {chartName ? `: ${chartName}` : ""}
                </h2>
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
                    {api.isPublishingEnabled() && chartPublish && <div className="w-full flex align-center justify-end"><NewTabLink href={ROUTES.viewChart(id)} className="btn btn-outline">{t(`header.preview.actions.viewChart.label`)}</NewTabLink></div>}
                    <ThemeSwitcherComponent
                      currentTheme={previewScheme}
                      handleChange={(value: ChartColorScheme) =>
                        setPreviewScheme(value)
                      }
                    />
                    <div
                      className="overflow-auto min-h-[380px] relative rounded-lg"
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
                          dataSource={dataSource ?? null}
                          {...chartA11y}
                        />
                      </ColorSchemeProvider>
                    </div>
                  </>
                ) : (
                  <p className="italic text-base-content"></p>
                )}
              </div>
              <div className="space-y-4">
                {haveData && (
                  <div className="flex items-center gap-3 text-sm text-base-content/70">
                    <span>{(dataSource ?? []).length} points loaded</span>
                    <button
                      type="button"
                      className="btn btn-xs btn-ghost"
                      onClick={() => {
                        setDataSource([]);
                        setLatField("lat");
                        setLngField("lng");
                        send({ type: "INPUT" });
                      }}
                    >
                      Clear all
                    </button>
                  </div>
                )}

                <div className="card bg-base-100 border border-base-300 shadow-sm">
                  <div className="card-body py-4">
                    <GeoSearch
                      dataSource={dataSource ?? []}
                      latField={latField}
                      lngField={lngField}
                      onAddPoints={(points) => {
                        const next = [...(dataSource ?? []), ...points];
                        setDataSource(next);
                        setHasUnsavedChanges(true);
                        if (!haveData) send({ type: "CONFIG" });
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}

