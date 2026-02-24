import { useMachine } from "@xstate/react";
import { DataTable, RenderChart, type MatrixType } from "dataviz-components";
import "dataviz-components/dist/style.css";
import dayjs from "dayjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ChartOptions from "../../components/ChartOptions";
import Layout from "../../components/layout";
import Loading from "../../components/layout/Loading";
import SelectChart from "../../components/SelectChart";
import { getAvailablePalettes, getPalette } from "../../lib/utils";

import ChooseLoader from "../../components/load-data/ChooseLoader";
import * as api from "../../lib/api";
import { defaultConfig } from "../../lib/constants";
import stepMachine from "../../lib/stepMachine";
import useStoreState from "../../lib/storeState";
import { HOME_ROUTE } from "../../router";
import { useUnsavedChanges } from "../../hooks/useUnsavedChanges";

import { FaCog, FaDatabase, FaInfo } from "react-icons/fa";
import toast from 'react-hot-toast';
import TransformData from "../../components/load-data/TransformData";

function EditChartPage() {
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


  const [loading, setLoading] = useState(true);
  const [chartName, setChartName] = useState<string>("");
  const [chartDescription, setChartDescription] = useState<string>("");
  const [chartPublish, setChartPublish] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState(false);
  const [currentData, setCurrentData] = useState<MatrixType | null>(null);


  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  useUnsavedChanges(hasUnsavedChanges, "You have unsaved changes. Are you sure you want to leave?");

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

  const haveData = currentData && currentData[0].length > 0 ? true :
    data && data[0].length > 0 ? true : dataSource ? true : false;

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
        toast.success("Chart saved successfully!");
      }
    } catch (error) {
      console.error("Error saving chart:", error);
      toast.error('Error saving chart!');
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
      <div className="w-full flex justify-between items-center gap-2 mb-4 bg-base-300 p-4 rounded-lg">
        <button
          type="button"
          onClick={() => navigate(HOME_ROUTE)}
          className="btn btn-default"
        >
          Back to list
        </button>
        <div className="flex gap-4">
          <span>step: {currentStepIndex}</span>
          <span>status: {state.value as string}</span>
          <span>to save: {hasUnsavedChanges ? "yes" : "no"}</span>
        </div>
        <div className="flex-shrink-0">
          <button
            type="button"
            onClick={saveChart}
            disabled={!hasUnsavedChanges || !canSave || isSaving}
            className="btn btn-primary gap-2"
          >
            {isSaving ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Saving...
              </>
            ) : (
              <>
                Save
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mx-auto">
        <div className="grid grid-cols-2 xl:grid-cols-6  gap-4">
          <div className="space-y-1 xl:col-span-2">

            <details className="collapse collapse-arrow bg-base-100 border border-base-300" name="my-accordion-det-0" aria-disabled={currentStepIndex === 0 ? true : false} open={currentStepIndex > 0 ? true : false}>
              <summary className="collapse-title font-semibold">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">
                      <FaCog />
                    </span>
                  </div>
                  <div>
                    <h2 className="card-title text-xl">
                      Configure the chart
                    </h2>
                    <p className="text-sm text-base-content/60">
                      Choose the chart type and customize its appearance
                    </p>
                  </div>
                </div>
              </summary>
              <div className="collapse-content text-sm">
                {state.matches("config") ? (

                  <div className="card bg-base-100 shadow-sm border border-base-200">
                    <div className="card-body">

                      <SelectChart setChart={(value: string) => { setHasUnsavedChanges(true); setChart(value); }} chart={chart} />
                      <div className="divider my-2"></div>
                      <ChartOptions
                        config={config}
                        setConfig={(value) => { setHasUnsavedChanges(true); setConfig(value); }}
                        chart={chart}
                        numSeries={(data as MatrixType)?.length - 1 || 0}
                      />
                    </div>
                  </div>

                ) : <div> Please load data and proceed to configuration step to see chart options </div>}
              </div>
            </details>

            <details className="collapse collapse-arrow bg-base-100 border border-base-300" name="my-accordion-det-1" open={currentStepIndex === 0 ? true : false}>
              <summary className="collapse-title font-semibold">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">
                      <FaDatabase />
                    </span>
                  </div>
                  <div>
                    <h2 className="card-title text-xl">Load your data</h2>
                    <p className="text-sm text-base-content/60">
                      Import data from CSV, JSON files or from a remote source
                    </p>
                  </div>
                </div>
              </summary>
              <div className="collapse-content text-sm">
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
                          Use this data
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </details>

            <details className="collapse collapse-arrow bg-base-100 border border-base-300" name="my-accordion-det-0">
              <summary className="collapse-title font-semibold">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">
                      <FaInfo />
                    </span>
                  </div>
                  <div>
                    <h2 className="card-title text-xl">Setup Info</h2>
                    <p className="text-sm text-base-content/60">
                      Name, description and visibility of the chart
                    </p>
                  </div>
                </div>
              </summary>
              <div className="collapse-content text-sm">
                <div className="card bg-base-100 shadow-sm border border-base-200">
                  <div className="card-body">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={chartPublish}
                          onChange={() => {
                            setHasUnsavedChanges(true);
                            setChartPublish(!chartPublish);
                          }}
                          className="toggle toggle-sm toggle-primary cursor-pointer"
                        />
                        <span className="text-sm text-base-content/70">
                          Chart Visibility:
                        </span>
                        <span className="text-sm text-base-content font-bold">
                          {chartPublish ? "Public" : "Private"}
                        </span>
                      </div>
                      <label htmlFor="chart_title" className="mt-4 text-base-content/70">Chart Title:</label>
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
                      <label htmlFor="chart_description" className="mt-4 text-base-content/70">Chart Description:</label>
                      <textarea
                        id="chart_description"
                        value={chartDescription}
                        rows={3}
                        onChange={(e) => {
                          setHasUnsavedChanges(true);
                          setChartDescription(e.target.value);
                        }}
                        placeholder="Add a description..."
                        className="input textarea input-bordered input-sm w-full bg-base-100 placeholder:text-base-content/40"
                      />

                    </div>
                  </div>
                </div>
              </div>
            </details>

          </div>

          {/* Right column: Preview */}
          <div className="xl:col-span-4 flex flex-col h-full p-10 border border-base-300 rounded-lg" >
            {/*
            <div role="tablist" className="tabs tabs-border">
              <button type="button" role="tab" className={`tab ${currentTab === "chart" ? "tab-active" : ""}`} onClick={() => setCurrentTab("chart")}>Chart</button>
              <button type="button" role="tab" className={`tab ${currentTab === "data" ? "tab-active" : ""}`} onClick={() => setCurrentTab("data")}>Data</button>
              <button type="button" role="tab" className={`tab ${currentTab === "info" ? "tab-active" : ""}`} onClick={() => setCurrentTab("info")}>Info</button>
            </div>
            */}

            <div className="bg-base-100 bg-base-100 bl-2 flex flex-col gap-4 min-h-[500px]">

              {/* {currentTab === "info" && ( */}
              <div  >
                <h1 className="text-2xl font-bold">{chartName}</h1>
                <div className="text-base-content/80">
                  {chartDescription ? (
                    <div dangerouslySetInnerHTML={{ __html: chartDescription.replace(/\n/g, "<br />") }} />
                  ) : (
                    <p className="italic text-base-content">
                      -
                    </p>
                  )}
                </div>
              </div>
              {/* )} */}

              {/* {currentTab === "chart" && ( */}
              <div  >
                {state.matches("config") && chart ? (

                  <div className="overflow-auto min-h-[380px] relative">
                    {/* {!preview && (
                      <div className="absolute inset-0 flex items-center justify-center bg-base-100 z-10">
                        <div className="flex flex-col items-center gap-3">
                          <span className="loading loading-spinner loading-lg text-primary"></span>
                          <span className="text-sm text-base-content/60">
                            Loading chart...
                          </span>
                        </div>
                      </div>
                    )} */}
                    <RenderChart
                      id={id || paramId || "preview-map"}
                      chart={chart}
                      data={data}
                      config={config}
                      dataSource={null}
                    // getPicture={(pic: string) => console.log("Chart picture", pic)}
                    />
                  </div>

                ) : (<p className="italic text-base-content"></p>)}
              </div>
              {/* )} */}

              {/* {currentTab === "data" && ( */}
              <div >
                {!haveData ? (
                  <p className="italic text-base-content">
                    Load your data to display the data preview
                  </p>
                ) :
                  (
                    <div className="overflow-auto flex-1 min-h-0">
                      {/* <DataTable data={(currentData || data) as any} /> */}
                      <TransformData
                        currentData={(currentData || data) as any}
                        handleTransformData={(d) => { setCurrentData(d); setHasUnsavedChanges(true); }}
                      />
                    </div>
                  )}

              </div>
              {/* )} */}


            </div>
          </div>
        </div>
      </div>
    </Layout >
  );
}

export default EditChartPage;
