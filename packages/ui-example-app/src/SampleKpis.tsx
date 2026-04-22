import {
  KpiItem,
  RenderChart,
  ColorSchemeProvider,
  type FieldDataType,
  type KpiItemType,
} from "graph-italia-components";
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

  const data3: FieldDataType = {
    id: "kpi-group3",
    dataSource: [
      {
        title: "Risorse allocate",
        value: "2778",
        value_prefix: "€",
        value_suffix: "milioni",
        background_color: "accent",
        footer_text: "I fondi assegnati agli enti tramite i decreti di finanziamento.",
      },
      {
        title: "Risorse liquidate",
        value: "1846",
        value_prefix: "€",
        value_suffix: "milioni",
        background_color: "accent",
        footer_text: "I fondi già erogati agli enti dopo aver completato i progetti.",
      },
    ],
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
      background: "",
    },
    data: null,
  };

  const singleKpi1 = generateFakeKpis(1)[0] as KpiItemType;
  const singleKpi2 = generateFakeKpis(1)[0] as KpiItemType;

  return (
    <div>
      <ColorSchemeProvider >
        <RenderChart {...data1} />
      </ColorSchemeProvider>
      <hr />
      <ColorSchemeProvider >
        <RenderChart {...data3} />
      </ColorSchemeProvider>
      <hr />
      <ColorSchemeProvider >
        <RenderChart {...data2} />
      </ColorSchemeProvider>
      <hr />
      <div className="dv-kpi-container">
        <div className="dv-kpi-row">
          <div className="dv-kpi-col-6">
            <KpiItem data={singleKpi1} />
          </div>
          <div className="dv-kpi-col-6">
            <KpiItem data={singleKpi2} />
          </div>
        </div>
      </div>
    </div >
  );
}

export default App;
