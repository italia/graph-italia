import {
  RenderChart,
  type FieldDataType,
  KpiItem,
  type KpiItemType,
} from "dataviz-components";
import { generateFakeKpis } from "./lib/utils";

function App() {
  const data1: FieldDataType = {
    id: "kpi-group1",
    dataSource: generateFakeKpis(10),
    chart: "kpi",
    config: {
      direction: "horizontal",
      h: 0,
      labeLine: false,
      legend: false,
      legendPosition: "",
      palette: [],
      tooltip: false,
      tooltipFormatter: "",
      valueFormatter: "",
      totalLabel: "",
      tooltipTrigger: "",
      colors: [],
      background: "pink",
    },
    data: null,
  };

  const data2: FieldDataType = {
    id: "kpi-group2",
    dataSource: generateFakeKpis(10),
    chart: "kpi",
    config: {
      direction: "vertical",
      h: 0,
      labeLine: false,
      legend: false,
      legendPosition: "",
      palette: [],
      tooltip: false,
      tooltipFormatter: "",
      valueFormatter: "",
      totalLabel: "",
      tooltipTrigger: "",
      colors: [],
      background: "skyblue",
    },
    data: null,
  };
  // return <KpiGroup data={data} />;

  const singleKpi1 = generateFakeKpis(1)[0] as KpiItemType;
  const singleKpi2 = generateFakeKpis(1)[0] as KpiItemType;

  return (
    <div>
      <RenderChart {...data1} />
      <hr />
      <RenderChart {...data2} />
      <div className='container'>
        <div className='row'>
          <div className='col-6'>
            <KpiItem data={singleKpi1} />
          </div>
          <div className='col-6'>
            <KpiItem data={singleKpi2} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
