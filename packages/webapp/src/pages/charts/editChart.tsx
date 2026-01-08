import { useMachine } from "@xstate/react";
import { DataTable, RenderChart } from "dataviz-components";
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

// Step definitions for the chart creation wizard (only 2 steps now)
const STEPS = [
  { id: "input", label: "Load Data", description: "Import your data" },
  { id: "config", label: "Configure", description: "Customize the chart" },
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
  const [chartDescription, setChartDescription] = useState<string>("");
  const [chartPublish, setChartPublish] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState(false);
  const [chartPreviewOpen, setChartPreviewOpen] = useState(true);
  const [dataPreviewOpen, setDataPreviewOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Ref to sync the right card height with the left one
  const leftCardRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
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

  // Track scroll to show/hide header save button
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect();
        setIsScrolled(rect.bottom < 100);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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

  // Generate default name based on chart type and date
  const getDefaultName = () => {
    return `${chart || "new"}chart-${dayjs(Date.now()).format(
      "YYYY-MM-DD_HH-mm"
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
        handleSaveChart();
        navigate("/home");
      }
    } catch (error) {
      console.error("Error saving chart:", error);
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
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header with chart info inputs and Save button */}
        <div ref={headerRef} className="mb-8">
          {/* Back navigation */}
          <div className="flex items-center gap-2 mb-4 -ml-2">
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
          </div>

          {/* Main header with inputs */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            {/* Left side: Name, Description, Publish */}
            <div className="flex-1 space-y-2 max-w-md">
              {/* Chart name as editable title */}
              <input
                type="text"
                value={chartName}
                onChange={(e) => setChartName(e.target.value)}
                placeholder={getDefaultName()}
                className="input input-bordered text-2xl font-bold h-auto py-2 px-3 w-full bg-base-100 placeholder:text-base-content/40"
              />
              {/* Description */}
              <input
                type="text"
                value={chartDescription}
                onChange={(e) => setChartDescription(e.target.value)}
                placeholder="Add a description..."
                className="input input-bordered input-sm w-full bg-base-100 placeholder:text-base-content/40"
              />
              {/* Publish toggle */}
              <div className="flex items-center gap-3">
                <span
                  role="switch"
                  aria-checked={chartPublish}
                  onClick={() => setChartPublish(!chartPublish)}
                  className={`toggle toggle-sm ${
                    chartPublish ? "toggle-primary" : ""
                  } cursor-pointer`}
                />
                <span className="text-sm text-base-content/60">
                  {chartPublish ? "Public" : "Private"}
                </span>
              </div>
            </div>

            {/* Save button in header - visible when not scrolled and in config step */}
            {!isScrolled && state.matches("config") && (
              <div className="flex-shrink-0">
                <button
                  onClick={saveChart}
                  disabled={!canSave || isSaving}
                  className="btn btn-primary gap-2"
                >
                  {isSaving ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Save
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stepper - Progress indicator (clickable) */}
        <div className="mb-8">
          <ul className="steps steps-horizontal w-full">
            {STEPS.map((step, index) => {
              // Determine if step is clickable
              const isStepClickable = index === 0 || (index === 1 && haveData);
              const isCurrentStep = index === currentStepIndex;

              const handleStepClick = () => {
                if (!isStepClickable || isCurrentStep) return;
                if (index === 0) {
                  send({ type: "IDLE" });
                } else if (index === 1) {
                  send({ type: "CONFIG" });
                }
              };

              return (
                <li
                  key={step.id}
                  className={`step ${
                    index <= currentStepIndex ? "step-primary" : ""
                  } ${
                    isStepClickable && !isCurrentStep ? "cursor-pointer" : ""
                  }`}
                  data-content={index < currentStepIndex ? "✓" : index + 1}
                  onClick={handleStepClick}
                >
                  <div className="hidden sm:block">
                    <span
                      className={`font-medium ${
                        isStepClickable && !isCurrentStep
                          ? "hover:text-primary transition-colors"
                          : ""
                      } ${
                        !isStepClickable && index > currentStepIndex
                          ? "text-base-content/40"
                          : ""
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                </li>
              );
            })}
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
          </div>

          {/* Right column: Preview */}
          <div className="flex flex-col min-h-[calc(100vh-280px)]">
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

                {/* Preview Accordions - Visible in Step 2 (Configure) */}
                {state.matches("config") && (
                  <div className="space-y-3 sticky top-4 z-10">
                    {/* Chart Preview Accordion */}
                    {chart && (
                      <div className="card bg-base-100 shadow-sm border border-base-200">
                        <div
                          className="card-title text-base px-4 py-3 cursor-pointer flex items-center justify-between"
                          onClick={() => setChartPreviewOpen(!chartPreviewOpen)}
                        >
                          <div className="flex items-center gap-2">
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
                          </div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-4 w-4 transition-transform ${
                              chartPreviewOpen ? "rotate-180" : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                        {chartPreviewOpen && (
                          <div className="card-body pt-0">
                            <div className="overflow-auto h-[380px] relative">
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
                          </div>
                        )}
                      </div>
                    )}

                    {/* Data Preview Accordion */}
                    <div className="card bg-base-100 shadow-sm border border-base-200">
                      <div
                        className="card-title text-base px-4 py-3 cursor-pointer flex items-center justify-between"
                        onClick={() => setDataPreviewOpen(!dataPreviewOpen)}
                      >
                        <div className="flex items-center gap-2">
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
                        </div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-4 w-4 transition-transform ${
                            dataPreviewOpen ? "rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                      {dataPreviewOpen && (
                        <div className="card-body pt-0">
                          <div className="overflow-auto max-h-[300px]">
                            <DataTable data={data as any} />
                          </div>
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

            {/* Save button - pushed to bottom, visible when scrolled and in config step */}
            {isScrolled && state.matches("config") && (
              <div className="mt-auto pt-4 flex justify-end sticky bottom-4">
                <button
                  onClick={saveChart}
                  disabled={!canSave || isSaving}
                  className="btn btn-primary gap-2 shadow-lg"
                >
                  {isSaving ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Save
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default EditChartPage;
