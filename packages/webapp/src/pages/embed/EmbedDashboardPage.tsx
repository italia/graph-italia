import React from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { Panel, PanelGroup } from "react-resizable-panels";
import { Link, useParams } from "react-router-dom";
import Loading from "../../components/layout/Loading";
// import RenderChart from "../../components/RenderCellChart";
import { RenderChart } from "dataviz-components";
import useDashboardViewStore from "../../store/dashboard-view.store";

const ROW_HEIGHT = 360;
const WIDGET_HEIGHT = 48;

const ResponsiveReactGridLayout = WidthProvider(Responsive);
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

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <PanelGroup direction='horizontal' className='w-full'>
        <Panel>
          <div className='p-4'>
            <div className='flex justify-between items-center'>
              <Link
                to={"/dashboards"}
                className='text-blue-500 hover:underline'
              >
                &lt; Torna alla lista
              </Link>
            </div>
            <div className=''>
              {isLoading && <Loading />}
              {error && (
                <div role='alert' className='alert alert-error'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-6 w-6 shrink-0 stroke-current'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                  <span>{error.message}</span>
                </div>
              )}
              {loaded && (
                <div>
                  <h1 className='text-4xl font-bold'>{name}</h1>
                  <h4 className='text-xl'>{description}</h4>
                  <div className='relative border min-h-[60vh]'>
                    <ResponsiveReactGridLayout
                      style={{ width: "100vw", height: "100vh" }}
                      className='react-grid-layout'
                      layouts={{
                        lg: layout,
                      }}
                      cols={cols}
                      margin={[10, 10]}
                      rowHeight={ROW_HEIGHT + WIDGET_HEIGHT}
                    >
                      {layout.map((item) => (
                        <div
                          className='react-grid-item overflow-hidden'
                          key={item.i}
                        >
                          <div>
                            <h3>
                              <b>{charts[item.i].name}</b>
                            </h3>
                            <p>{charts[item.i].description}</p>
                          </div>
                          {charts && charts[item.i] && (
                            <RenderChart
                              {...(charts[item.i] as any)}
                              fullH={ROW_HEIGHT}
                              hFactor={item.h}
                            />
                          )}
                        </div>
                      ))}
                    </ResponsiveReactGridLayout>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}

export default DashboardViewPage;
