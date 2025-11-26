import {
  RenderChart,
  type FieldDataType,
  type PointData,
} from "dataviz-components";

import { useState } from "react";
import { generateSamplePoints } from "./lib/generatePoints";

function App() {
  const [pointsData] = useState<PointData[]>(() => generateSamplePoints(100));

  const data: FieldDataType = {
    id: "clustermap1",
    dataSource: pointsData,
    chart: "cmap",
    config: {
      direction: "horizontal",
      h: 500,
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
    },
    data: null,
  };

  //<ClusterMap data={data} />;
  return (
    <div>
      <RenderChart {...data} />
    </div>
  );
}

export default App;
