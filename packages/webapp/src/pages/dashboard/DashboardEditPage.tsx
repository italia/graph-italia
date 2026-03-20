import React from "react";
import { Responsive, } from "react-grid-layout";
import { Link, useParams } from "react-router-dom";
import Layout from "../../components/layout";
import Dialog from "../../components/layout/Dialog";
import Loading from "../../components/layout/Loading";
// import RenderChart from "../../components/RenderCellChart";
import { ChartWrapper, ColorSchemeProvider, RenderChart, type FieldDataType, type InfosType } from "dataviz-components";
import * as api from "../../lib/api";
import useDashboardEditStore, {
  type ChartLookup,
  type TChartRef,
  type TLayoutItem,
} from "../../store/dashboard-edit.store";
import { useSettingsStore } from "../../store/settings_store";

const ROW_HEIGHT = 360;
const WIDGET_HEIGHT = 48;

interface ChartSelectionProps {
  charts: Record<string, TChartRef>;
  onSelect: (chart?: TChartRef) => void;
}

function ChartSelection(props: ChartSelectionProps) {
  const [charts, setCharts] = React.useState<Array<ChartLookup>>([]);
  const [chart, setChart] = React.useState<TChartRef>();

  const mergeCharts = (charts: Array<ChartLookup>) => {
    const idsToRemove = new Set(Object.values(props.charts).map((m) => m.id));
    const filteredCharts = charts.filter((c) => !idsToRemove.has(c.id));
    setCharts(filteredCharts);
  };

  async function fetchCharts() {
    try {
      const data = await api.getCharts();
      mergeCharts(data);
    } catch (error) {
    } finally {
    }
  }

  React.useEffect(() => {
    fetchCharts();
  }, []);




  return (
    <div>
      {charts && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
          }}
        >
          <label htmlFor="select-chart" style={{ width: "200px" }}>Select a chart type:</label>
          <select
            id="select-chart"
            className="select select-primary my-2 p-2"
            style={{ width: "100%" }}
            value={chart?.id}
            onChange={(e) => {
              const chartId = e.target.value;
              setChart({ id: chartId });
              const chart = charts.find((c) => c.id === chartId);
              props.onSelect(chart);
            }}
          >
            <option value="">{`-select a chart-`}</option>
            {charts.map((c, index) => {
              return (
                <option key={`${c.id}-${index}`} value={c.id}>
                  {c.name}
                </option>
              );
            })}
          </select>
        </div>
      )}
    </div>
  );
}
// narrow the props if you want stronger typing;
const ResponsiveReactGridLayout = Responsive;
const cols = { lg: 4, md: 2, sm: 1, xs: 1, xxs: 1 } as const;

function DashboardEditPage() {
  const { id } = useParams();

  const {
    layout,
    show,
    charts,
    name,
    description,
    isLoading,
    error,
    loaded,
    setBreakpoint,
    setSelectedChart,
    setLayout,
    addItem,
    deleteItem,
    showAddModal,
    closeAddModal,
    load,
    reload,
    save,
  } = useDashboardEditStore();

  function addChartHandler(item: string) {
    showAddModal(item);
  }

  function addItemHandler() {
    addItem();
  }

  function deleteItemHandler(id: string) {
    deleteItem(id);
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

  React.useEffect(() => {
    if (id) {
      load(id);
    }
  }, [load]);

  const { settings } = useSettingsStore();
  const scheme = settings?.preferredTheme ?? "light";

  return (
    <Layout>
      <div className="p-4">
        <div className="flex justify-between items-center">
          <Link to="/dashboards" className="text-blue-500 hover:underline">
            &lt; Back to the list
          </Link>
          <div className="ml-auto flex space-x-2">
            <button type="button" onClick={resetHandler} className="btn btn-primary">
              Reset
            </button>
            <button type="button" onClick={saveHandler} className="btn btn-primary">
              Save
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
            <h1 className="text-4xl font-bold">{name}</h1>
            <h4 className="text-xl">{description}</h4>
            <div className="flex flex-wrap items-center">
              <button
                type="button"
                className="m-2 btn btn-xs btn-primary"
                onClick={addItemHandler}
              >
                Add +
              </button>
              {layout.map((l) => (
                <button
                  type="button"
                  key={l.i}
                  className="m-2 btn btn-xs btn-error"
                  onClick={() => deleteItemHandler(l.i)}
                >
                  {l.i}
                </button>
              ))}
            </div>
            <div className="relative border min-h-[60vh]">
              <ResponsiveReactGridLayout
                onLayoutChange={(layout) => setLayout([...layout] as TLayoutItem[])}
                onBreakpointChange={setBreakpoint}
                className="react-grid-layout"
                layouts={{ lg: layout }}
                cols={cols}
                margin={[10, 10]}
                rowHeight={ROW_HEIGHT + WIDGET_HEIGHT}
                width={1200}
              >
                {layout.map((item) => {
                  let currentChart = charts[item.i] as FieldDataType;
                  const info: InfosType = {
                    text: currentChart.description || "",
                    title: currentChart.name || ""

                    // labelSource ?: string;
                    // sourceTextInfo ?: string;
                    // labelShare ?: string;
                    // labelUpdated ?: string;
                    // sharedUrl ?: string;
                    // labelTabInfo ?: string;
                    // labelTabChart ?: string;
                    // labelTabData ?: string;
                    // labelDownloadData ?: string;
                    // labelDownloadImage ?: string;
                    // chartFooterText ?: string;
                  }
                  currentChart.description = "";
                  // currentChart.showHeading = false
                  return (
                    <div
                      className="react-grid-item overflow-hidden"
                      key={item.i}
                    >
                      {currentChart ? (
                        <>
                          <div>
                            <div className="flex justify-between">
                              {/* <span className="text-right rounded-md bg-red-700 py-0.5 px-2.5 border border-transparent text-sm text-white transition-all shadow-sm">
                                {item.i}
                              </span> */}
                            </div>
                          </div>
                          <ColorSchemeProvider scheme={scheme}>
                            <ChartWrapper
                              id={currentChart.id}
                              data={currentChart}
                              info={info}
                              rowHeight={ROW_HEIGHT}
                              hFactor={item.h}
                            // showHeading= false
                            />
                            {/* <RenderChart
                              {...currentChart}
                            /> */}
                          </ColorSchemeProvider>
                        </>
                      ) : (
                        <button
                          type="button"
                          className="m-2 btn btn-xs btn-primary"
                          onClick={() => addChartHandler(item.i)}
                        >
                          Add Chart +
                        </button>
                      )}
                    </div>
                  )
                })}
              </ResponsiveReactGridLayout>
            </div>
          </>
        )}
        {show && (
          <Dialog
            toggle={show}
            title="Select a chart"
            callback={() => {
              closeAddModal();
            }}
          >
            <ChartSelection charts={charts} onSelect={setSelectedChart} />
          </Dialog>
        )}
      </div>
    </Layout>
  );
}

export default DashboardEditPage;
