import SampleBarchart from "./SampleBarchart";
import SampleGeomapchart from "./SampleGeomapchart";
import SampleKpis from "./SampleKpis";
import SampleLinechart from "./SampleLinechart";
import SampleMap from "./SampleMap";
import SamplePiechart from "./SamplePiechart";

import "graph-italia-components/dist/style.css";
import SampleTable from "./SampleTable";
import SampleWrapper from "./SampleWrapper";
import SampleWrapperBar from "./SampleWrapperBar";
import SampleWrapperGeomap from "./SampleWrapperGeomap";
import SampleWrapperLine from "./SampleWrapperLine";
import SampleWrapperPie from "./SampleWrapperPie";

export default function App() {
  return (
    <div style={{ padding: 30, width: "60vw" }}>
      <div style={{ marginTop: 50, minHeight: 900 }}>
        <h3>Sample Wrapper</h3>
        <SampleWrapper />
        <div style={{ marginTop: 40 }}>
          <h4>Bar Chart con ChartWrapper</h4>
          <SampleWrapperBar />
        </div>
        <div style={{ marginTop: 40 }}>
          <h4>Line Chart con ChartWrapper</h4>
          <SampleWrapperLine />
        </div>
        <div style={{ marginTop: 40 }}>
          <h4>Pie Chart con ChartWrapper</h4>
          <SampleWrapperPie />
        </div>
        <div style={{ marginTop: 40 }}>
          <h4>Geo Map con ChartWrapper</h4>
          <SampleWrapperGeomap />
        </div>
      </div>
      <div style={{ marginTop: 50 }}>
        <h3>Table</h3>
        <SampleTable />
      </div>
      <div style={{ marginTop: 50, height: 700 }}>
        <h3>GEO Map</h3>
        <SampleGeomapchart />
      </div>
      <div style={{ marginTop: 50 }}>
        <h3>Bar Chart</h3>
        <SampleBarchart />
      </div>
      <div style={{ marginTop: 50 }}>
        <h3>Line Chart</h3>
        <SampleLinechart />
      </div>
      <div style={{ marginTop: 50 }}>
        <h3>Pie Chart</h3>
        <SamplePiechart />
      </div>
      <div style={{ marginTop: 50, marginBottom: 50 }}>
        <h3>Kpis</h3>
        <SampleKpis />
      </div>

      <div style={{ marginTop: 50, marginBottom: 50, height: 600 }}>
        <h3>Cluster Map</h3>
        <SampleMap />
      </div>
    </div>
  );
}
