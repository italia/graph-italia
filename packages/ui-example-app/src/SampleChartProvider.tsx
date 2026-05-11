import { ChartProvider } from "graph-italia-components";

// Replace these with your real values from the project settings
const API_KEY = import.meta.env.VITE_API_KEY ?? "dv_your_project_key";
const ENDPOINT = import.meta.env.VITE_ENDPOINT ?? "http://localhost:3003";
const CHART_ID = import.meta.env.VITE_CHART_ID ?? "your-chart-id";

export default function SampleChartProvider() {
  return (
    <div>
      <h4 style={{ marginBottom: 12 }}>ChartProvider — bare render</h4>
      <div style={{ height: 400 }}>
        <ChartProvider
          apiKey={API_KEY}
          endpoint={ENDPOINT}
          chartId={CHART_ID}
        />
      </div>

      <h4 style={{ marginTop: 40, marginBottom: 12 }}>
        ChartProvider — with ChartWrapper (tabs, download, data table)
      </h4>
      <div style={{ height: 500 }}>
        <ChartProvider
          apiKey={API_KEY}
          endpoint={ENDPOINT}
          chartId={CHART_ID}
          withWrapper
          detectUserPrefColorsSchema
        />
      </div>
    </div>
  );
}
