import { useEffect, useState } from "react";
import { ColorSchemeProvider } from "graph-italia-components";
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
import SampleChartProvider from "./SampleChartProvider";
import SampleDashboardProvider from "./SampleDashboardProvider";
import SampleDashboardGridProvider from "./SampleDashboardGridProvider";

export default function App() {
  const [scheme, setScheme] = useState<"light" | "dark">("light");
  const isDark = scheme === "dark";

  useEffect(() => {
    document.body.style.backgroundColor = isDark ? "#0f1115" : "#ffffff";
    document.body.style.color = isDark ? "#e5e7eb" : "#17324d";
  }, [isDark]);

  const appStyle: React.CSSProperties = {
    padding: 30,
    width: "60vw",
    minHeight: "100vh",
    backgroundColor: isDark ? "#0f1115" : "#ffffff",
    color: isDark ? "#e5e7eb" : "#111827",
    transition: "background-color 200ms ease, color 200ms ease",
  };

  const toggleStyle: React.CSSProperties = {
    position: "fixed",
    top: 16,
    right: 16,
    zIndex: 1000,
    padding: "8px 14px",
    borderRadius: 6,
    border: `1px solid ${isDark ? "#4b5563" : "#d1d5db"}`,
    background: isDark ? "#1f2937" : "#ffffff",
    color: isDark ? "#e5e7eb" : "#111827",
    cursor: "pointer",
    fontWeight: 600,
  };

  return (
    <ColorSchemeProvider scheme={scheme}>
      <div style={appStyle}>
        <button
          type="button"
          style={toggleStyle}
          onClick={() => setScheme(isDark ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          {isDark ? "Light mode" : "Dark mode"}
        </button>

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

        <div style={{ marginTop: 50, marginBottom: 50 }}>
          <h3>ChartProvider</h3>
          <SampleChartProvider />
        </div>

        <div style={{ marginTop: 50, marginBottom: 50 }}>
          <h3>DashboardProvider</h3>
          <SampleDashboardProvider />
        </div>

        <div style={{ marginTop: 50, marginBottom: 50 }}>
          <h3>DashboardGridProvider</h3>
          <SampleDashboardGridProvider />
        </div>
      </div>
    </ColorSchemeProvider>
  );
}
