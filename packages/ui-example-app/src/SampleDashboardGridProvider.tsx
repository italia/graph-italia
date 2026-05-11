import { DashboardGridProvider } from "graph-italia-components";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

// Replace these with your real values from the project settings
const API_KEY = import.meta.env.VITE_API_KEY ?? "dv_your_project_key";
const ENDPOINT = import.meta.env.VITE_ENDPOINT ?? "http://localhost:3003";
const DASHBOARD_ID = import.meta.env.VITE_DASHBOARD_ID ?? "your-dashboard-id";

export default function SampleDashboardGridProvider() {
  return (
    <DashboardGridProvider
      apiKey={API_KEY}
      endpoint={ENDPOINT}
      dashboardId={DASHBOARD_ID}
      showHeading
      rowHeight={380}
      margin={16}
      detectUserPrefColorsSchema
    />
  );
}
