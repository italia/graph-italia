import React from "react";
import { Responsive, } from "react-grid-layout";

import { Link, useParams } from "react-router-dom";
import Layout from "../../components/layout";
import Loading from "../../components/layout/Loading";
// import RenderChart from "../../components/RenderCellChart";
import { ColorSchemeProvider, RenderChart, type FieldDataType } from "dataviz-components";
import useDashboardViewStore from "../../store/dashboard-view.store";
import { useSettingsStore } from "../../store/settings_store";

const ROW_HEIGHT = 360;
const WIDGET_HEIGHT = 48;

const ResponsiveReactGridLayout = Responsive
const cols = { lg: 4, md: 2, sm: 1, xs: 1, xxs: 1 } as const;

function DashboardViewPage() {
  const { id } = useParams();
  const { load, layout, charts, name, description, isLoading, loaded, error } =
    useDashboardViewStore();

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
          <Link
            to={"/dashboards"}
            className="text-blue-500 hover:underline"
          >
            &lt; Torna alla lista
          </Link>
        </div>
        <div className="">
          {isLoading && <Loading />}
          {error && (
            <div role="alert" className="alert alert-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error.message}</span>
            </div>
          )}
          {loaded && (
            <div>
              <h1 className="text-4xl font-bold">{name}</h1>
              <h4 className="text-xl">{description}</h4>
              <div className="relative border min-h-[60vh]">
                <ResponsiveReactGridLayout
                  className="react-grid-layout"
                  layouts={{
                    lg: layout,
                  }}
                  cols={cols}
                  margin={[10, 10]}
                  rowHeight={ROW_HEIGHT + WIDGET_HEIGHT}
                  width={1200}
                >
                  {layout.map((item) => {
                    const currentChart = charts[item.i] as FieldDataType;
                    return (
                      <div
                        className="react-grid-item overflow-hidden"
                        key={item.i}
                      >
                        {charts && currentChart && (
                          <ColorSchemeProvider scheme={scheme}>
                            <RenderChart
                              {...currentChart}
                              rowHeight={ROW_HEIGHT}
                              hFactor={item.h}
                            />
                          </ColorSchemeProvider>
                        )}
                      </div>
                    )
                  })}
                </ResponsiveReactGridLayout>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout >
  );
}

export default DashboardViewPage;
