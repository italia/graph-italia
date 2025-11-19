import SampleBarchart from "./SampleBarchart";
import SamplePiechart from "./SamplePiechart";
import SampleLinechart from "./SampleLinechart";
import SampleGeomapchart from "./SampleGeomapchart";
import SampleMap from "./SampleMap";
import SampleKpis from "./SampleKpis";

import "dataviz-components/dist/style.css";
import SampleTable from "./SampleTable";
import SampleWrapper from "./SampleWrapper";

export default function App() {
  return (
    <div style={{ padding: 30, width: "60vw" }}>
      <div style={{ marginTop: 50, minHeight: 900 }}>
        <h3>Sample Wrapper</h3>
        <SampleWrapper />
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
