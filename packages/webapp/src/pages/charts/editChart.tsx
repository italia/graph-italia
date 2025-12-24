import { useMachine } from "@xstate/react";
import { DataTable, RenderChart } from "dataviz-components";
import "dataviz-components/dist/style.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ChartOptions from "../../components/ChartOptions";
import ChartSave from "../../components/ChartSave";
import Layout from "../../components/layout";
import Loading from "../../components/layout/Loading";
import SelectChart from "../../components/SelectChart";
import { getAvailablePalettes, getPalette } from "../../lib/utils";

import ChooseLoader from "../../components/load-data/ChooseLoader";
import * as api from "../../lib/api";
import { defaultConfig } from "../../lib/constants";
import stepMachine from "../../lib/stepMachine";
import useStoreState from "../../lib/storeState";

// Step definitions for the chart creation wizard
const STEPS = [
  { id: "input", label: "Load Data", description: "Import your data" },
  { id: "config", label: "Configure", description: "Customize the chart" },
  { id: "done", label: "Save", description: "Save and publish" },
];

function EditChartPage() {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const [state, send] = useMachine(stepMachine);
  const {
    config,
    chart,
    data,
    id,
    name,
    description,
    publish,
    isRemote,
    remoteUrl,
    preview,
    dataSource,

    setPreview,
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

  // Ref to sync the right card height with the left one
  const leftCardRef = useRef<HTMLDivElement>(null);
  const [leftCardHeight, setLeftCardHeight] = useState<number | null>(null);

  // Update height when the left card content changes
  const updateLeftCardHeight = useCallback(() => {
    if (leftCardRef.current) {
      setLeftCardHeight(leftCardRef.current.offsetHeight);
    }
  }, []);

  // Observe size changes of the left card
  useEffect(() => {
    updateLeftCardHeight();

    // Use ResizeObserver to detect size changes
    const resizeObserver = new ResizeObserver(() => {
      updateLeftCardHeight();
    });

    if (leftCardRef.current) {
      resizeObserver.observe(leftCardRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [updateLeftCardHeight, state.value, data]);

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
          }
        } catch (error) {
          console.error("Error loading chart:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
    loadExistingChart();
  }, [paramId]);

  function handleChangeData(d: any) {
    if (!config.palette) {
      const numSeries = d.length - 1;
      let palette = getAvailablePalettes(numSeries)[0];
      config.palette = palette;
      config.colors = getPalette(palette);
      setConfig(config);
    }
    // setChart("");
    setData(d);
    // Don't transition automatically - user must click "Proceed to configuration"
  }
  const haveData =
    data && data[0].length > 0 ? true : dataSource ? true : false;

  function handleUpload(d: any) {
    setData(d);
    // Don't transition automatically - user must click "Proceed to configuration"
    if (state.matches("idle")) {
      send({ type: "NEXT" }); // Only from idle to input
    }
  }
  function handleSetRemoteData(d: any) {
    console.log("handleSetRemoteData", d);
    setIsRemote(true);
    setRemoteUrl(d.remoteUrl);
    setData(d.data);
    // Don't transition automatically - user must click "Proceed to configuration"
    if (state.matches("idle")) {
      send({ type: "NEXT" }); // Only from idle to input
    }
  }

  function handleSaveChart() {
    send({ type: "IDLE" });
    resetItem();
  }

  // Determine current step for display
  const getCurrentStepIndex = () => {
    if (state.matches("idle") || state.matches("input")) return 0;
    if (state.matches("config")) return 1;
    if (state.matches("done")) return 2;
    return 0;
  };

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
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header with navigation and title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4 -ml-2">
            {/* Step 1: Only "Back to list" */}
            {(state.matches("idle") || state.matches("input")) && (
              <button
                onClick={() => navigate("/home")}
                className="btn btn-ghost btn-sm gap-2 text-base-content/70 hover:text-base-content"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to list
              </button>
            )}

            {/* Step 2: "Back to data" */}
            {state.matches("config") && (
              <button
                onClick={() => send({ type: "IDLE" })}
                className="btn btn-ghost btn-sm gap-2 text-base-content/70 hover:text-base-content"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to data
              </button>
            )}

            {/* Step 3: "Back to configuration" */}
            {state.matches("done") && (
              <button
                onClick={() => send({ type: "CONFIG" })}
                className="btn btn-ghost btn-sm gap-2 text-base-content/70 hover:text-base-content"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to configuration
              </button>
            )}

            {/* Separator and link to list (for steps 2 and 3) */}
            {(state.matches("config") || state.matches("done")) && (
              <>
                <span className="text-base-content/30">|</span>
                <button
                  onClick={() => navigate("/home")}
                  className="btn btn-ghost btn-sm gap-1 text-base-content/50 hover:text-base-content"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  List
                </button>
              </>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-3xl font-bold text-base-content">
                {paramId ? "Edit Chart" : "New Chart"}
              </h1>
              {chartName && (
                <p className="text-lg text-base-content/60 mt-1">{chartName}</p>
              )}
            </div>
          </div>
        </div>

        {/* Stepper - Progress indicator */}
        <div className="mb-8">
          <ul className="steps steps-horizontal w-full">
            {STEPS.map((step, index) => (
              <li
                key={step.id}
                className={`step ${
                  index <= currentStepIndex ? "step-primary" : ""
                }`}
                data-content={index < currentStepIndex ? "✓" : index + 1}
              >
                <div className="hidden sm:block">
                  <span className="font-medium">{step.label}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Main content in two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column: Form/Configuration */}
          <div className="space-y-6">
            {/* Step 1: Data loading */}
            {(state.matches("idle") || state.matches("input")) && (
              <div
                ref={leftCardRef}
                className="card bg-base-100 shadow-sm border border-base-200"
              >
                <div className="card-body">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold">1</span>
                    </div>
                    <div>
                      <h2 className="card-title text-xl">Load your data</h2>
                      <p className="text-sm text-base-content/60">
                        Import data from CSV, JSON files or from a remote source
                      </p>
                    </div>
                  </div>
                  <ChooseLoader
                    handleUpload={handleUpload}
                    remoteUrl={remoteUrl}
                    handleSetRemoteData={handleSetRemoteData}
                    initialData={data}
                  />

                  {/* Button to proceed to configuration */}
                  {haveData && chart && (
                    <div className="card-actions justify-end mt-6 pt-4 border-t border-base-200">
                      <button
                        className="btn btn-primary"
                        onClick={() => send({ type: "CONFIG" })}
                      >
                        Proceed to configuration
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Configuration */}
            {state.matches("config") && (
              <div className="card bg-base-100 shadow-sm border border-base-200">
                <div className="card-body">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold">2</span>
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
                  <SelectChart setChart={setChart} chart={chart} />
                  <div className="divider my-2"></div>
                  <ChartOptions
                    config={config}
                    setConfig={setConfig}
                    chart={chart}
                    numSeries={(data as any)?.length - 1 || 0}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Saving */}
            {state.matches("done") && (
              <div className="card bg-base-100 shadow-sm border border-base-200">
                <div className="card-body">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold">3</span>
                    </div>
                    <div>
                      <h2 className="card-title text-xl">Save the chart</h2>
                      <p className="text-sm text-base-content/60">
                        Name the chart and choose whether to publish it
                      </p>
                    </div>
                  </div>
                  <ChartSave
                    item={{
                      id: paramId || id,
                      chart,
                      name: chartName || name,
                      description,
                      publish,
                      config,
                      data,
                      remoteUrl,
                      isRemote,
                      preview,
                    }}
                    handleSave={() => handleSaveChart()}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right column: Preview */}
          <div className="space-y-6">
            {haveData && (
              <>
                {/* Data Preview Card - Visible only in Step 1 */}
                {(state.matches("idle") || state.matches("input")) && (
                  <div
                    className="card bg-base-100 shadow-sm border border-base-200 flex flex-col"
                    style={{
                      maxHeight: leftCardHeight
                        ? `${leftCardHeight}px`
                        : "500px",
                    }}
                  >
                    <div className="card-body flex flex-col min-h-0">
                      <h3 className="card-title text-lg flex items-center gap-2 flex-shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-base-content/60"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 3v4M15 3v4M4 11h16"
                          />
                        </svg>
                        Data preview
                      </h3>
                      <div className="overflow-auto flex-1 min-h-0">
                        <DataTable data={data as any} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Chart Preview Card - Visible from Step 2 onwards, Sticky during configuration */}
                {chart &&
                  (state.matches("config") || state.matches("done")) && (
                    <div
                      className={`card bg-base-100 shadow-sm border border-base-200 ${
                        state.matches("config") ? "sticky top-4" : ""
                      }`}
                    >
                      <div className="card-body">
                        <h3 className="card-title text-lg flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-base-content/60"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                          </svg>
                          Chart preview
                        </h3>
                        <div className="mt-4 overflow-auto h-[420px] relative">
                          {!preview && (
                            <div className="absolute inset-0 flex items-center justify-center bg-base-100 z-10">
                              <div className="flex flex-col items-center gap-3">
                                <span className="loading loading-spinner loading-lg text-primary"></span>
                                <span className="text-sm text-base-content/60">
                                  Loading chart...
                                </span>
                              </div>
                            </div>
                          )}
                          <RenderChart
                            chart={chart}
                            data={data}
                            config={config}
                            dataSource={null}
                            getPicture={(pic: string) => setPreview(pic)}
                          />
                        </div>
                        {/* Button to proceed to saving (only in Step 2) */}
                        {state.matches("config") && (
                          <div className="card-actions justify-end mt-4">
                            <button
                              className="btn btn-primary"
                              onClick={() => send({ type: "DONE" })}
                            >
                              Proceed to save
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 ml-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
              </>
            )}

            {/* Placeholder when there's no data */}
            {!haveData && (
              <div className="card bg-base-200/50 border-2 border-dashed border-base-300 min-h-[300px]">
                <div className="card-body items-center justify-center text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-base-content/30 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-base-content/60">
                    Chart preview
                  </h3>
                  <p className="text-sm text-base-content/40 max-w-xs">
                    Load your data to display the chart preview
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default EditChartPage;
