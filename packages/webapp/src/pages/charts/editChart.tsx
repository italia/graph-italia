import { useMachine } from "@xstate/react";
import type { ChartColorScheme } from "dataviz-components";
import {
  ColorSchemeProvider,
  RenderChart,
  type MatrixType,
} from "dataviz-components";
import "dataviz-components/dist/style.css";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ChartOptions from "../../components/ChartOptions";
import Layout from "../../components/layout";
import Loading from "../../components/layout/Loading";
import SelectChart from "../../components/SelectChart";
// import { getAvailablePalettes, getPalette } from "../../lib/utils";

import ChooseLoader from "../../components/load-data/ChooseLoader";
import { useUnsavedChanges } from "../../hooks/useUnsavedChanges";
import * as api from "../../lib/api";
import { defaultConfig } from "../../lib/constants";
import stepMachine from "../../lib/stepMachine";
import useStoreState from "../../lib/storeState";
import { HOME_ROUTE } from "../../router";
import { useSettingsStore } from "../../store/settings_store.ts";

import { Helmet } from "react-helmet";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { FaCog, FaDatabase, FaInfo } from "react-icons/fa";
import EditStepComponent from "../../components/EditStepComponent";
import TransformData from "../../components/load-data/TransformData";
import ThemeSwitcherComponent from "../../components/ThemeSwitcherComponent";

function EditChartPage() {
  const { t } = useTranslation(undefined, {
    keyPrefix: `pages.charts.editChart`,
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
    // name,
    // description,
    // publish,
    // preview,
    // setPreview,
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
  const [chartPublish, setChartPublish] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState(false);
  const { settings } = useSettingsStore();
  const [previewScheme, setPreviewScheme] = useState<ChartColorScheme>(
    settings?.preferredTheme === "dark" ? "dark" : "light",
  );

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  useUnsavedChanges(hasUnsavedChanges, t(`unsavedChanges`));

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
            setChartPublish(chartData.publish ?? true);

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
        setChartPublish(true);
        setLoading(false);
      }
    }
    loadExistingChart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramId]);

  // function handleChangeData(d: any) {
  //   if (!config.palette) {
  //     const numSeries = d.length - 1;
  //     let palette = getAvailablePalettes(numSeries)[0];
  //     config.palette = palette;
  //     config.colors = getPalette(palette);
  //     setConfig(config);
  //   }
  //   // setChart("");
  //   setData(d);
  //   setHasUnsavedChanges(true);
  //   // Don't transition automatically - user must click "Proceed to configuration"
  // }

  const haveData =
    currentData && currentData[0].length > 0
      ? true
      : data && data[0].length > 0
        ? true
        : dataSource
          ? true
          : false;

  function handleUpload(d: any) {
    setHasUnsavedChanges(true);
    setCurrentData(d);
    // Don't transition automatically - user must click "Proceed to configuration"
    if (state.matches("idle")) {
      send({ type: "NEXT" }); // Only from idle to input
    }
  }

  function handleSetRemoteData(d: any) {
    setHasUnsavedChanges(true);
    setIsRemote(true);
    setRemoteUrl(d.remoteUrl);
    setCurrentData(d.data);

    // Don't transition automatically - user must click "Proceed to configuration"
    if (state.matches("idle")) {
      send({ type: "NEXT" }); // Only from idle to input
    }
  }

  function handleAssignData() {
    if (currentData) {
      setData(currentData);
      setCurrentData(null); // Clear temp data
      send({ type: "CONFIG" }); // Move to config step after data is assigned
    }
  }

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
      publish: chartPublish,
      chart: chart || "bar",
      config,
      data,
      isRemote,
      remoteUrl,
    };

    setIsSaving(true);
    try {
      const result = await api.upsertChart(payload, paramId || id || "");
      if (result) {
        setHasUnsavedChanges(false);
        //   handleSaveChart();
        //   navigate(HOME_ROUTE);;
        toast.success(t(`save.success.label`));
      }
    } catch (error) {
      console.error("Error saving chart:", error);
      toast.error(t(`save.error.label`));
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
      <div className="w-full flex justify-between items-center gap-2 mb-4 bg-base-300 py-4 px-10 rounded-lg">
        <button
          type="button"
          onClick={() => navigate(HOME_ROUTE)}
          className="btn btn-outline"
        >
          {t(`header.actions.back.label`)}
        </button>
        <div className="flex gap-4">
          {/* <span>step: {currentStepIndex}</span>
          <span>status: {state.value as string}</span> */}
          {/* <span>to save: {hasUnsavedChanges ? "yes" : "no"}</span> */}
        </div>
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

      <div className="mx-auto">
        <div className="grid grid-cols-2 xl:grid-cols-6  gap-4">
          <div className="space-y-1 xl:col-span-2">
            <EditStepComponent
              title={t(`body.options.setup.title`)}
              description={t(`body.options.setup.description`)}
              Icon={FaInfo}
              isOpen={true}
              isDisabled={false}
              index={0}
            >
              <div className="card bg-base-100 shadow-sm border border-base-200">
                <div className="card-body">
                  <div className="flex flex-col space-y-2">
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
                      className="input input-bordered py-2 px-3 w-full bg-base-100 placeholder:text-base-content/40"
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
                      className="input textarea input-bordered input-sm w-full bg-base-100 placeholder:text-base-content/40"
                    />
                  </div>
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
                  <div className="card bg-base-100 shadow-sm border border-base-200">
                    <div className="card-body">
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
                  </div>
                ) : (
                  <div role="status">
                    {" "}
                    {t(`body.options.configuration.status`)}{" "}
                  </div>
                )}
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
              <div className="card bg-base-100 shadow-sm border border-base-200">
                <div className="card-body">
                  <ChooseLoader
                    handleUpload={handleUpload}
                    remoteUrl={remoteUrl}
                    handleSetRemoteData={handleSetRemoteData}
                    initialData={data}
                  />
                  {haveData && chart && (
                    <div className="card-actions justify-end mt-6 pt-4 border-t border-base-200">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => handleAssignData()}
                      >
                        {t(`body.options.data.actions.useData.label`)}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </EditStepComponent>
          </div>

          {/* Right column: Preview */}
          <div className="xl:col-span-4 flex flex-col h-full p-10 bg-base-100  border border-base-300 rounded-lg">
            <div className="bg-base-100 bl-2 flex flex-col gap-4 min-h-[500px]">
              <div>
                <h1 className="text-2xl font-bold">{chartName}</h1>
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
                          dataSource={null}
                        />
                      </ColorSchemeProvider>
                    </div>
                  </>
                ) : (
                  <p className="italic text-base-content"></p>
                )}
              </div>
              <div>
                {!haveData ? (
                  <p className="italic text-base-content" role="status">
                    {t(`body.preview.loadDataMessage`)}
                  </p>
                ) : (
                  <div className="overflow-auto flex-1 min-h-0">
                    {/* <DataTable data={(currentData || data) as any} /> */}
                    <TransformData
                      currentData={(currentData || data) as any}
                      handleTransformData={(d) => {
                        setCurrentData(d);
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default EditChartPage;
