import { DashboardProvider } from "graph-italia-components";

// Replace these with your real values from the project settings
const API_KEY = import.meta.env.VITE_API_KEY ?? "dv_your_project_key";
const ENDPOINT = import.meta.env.VITE_ENDPOINT ?? "http://localhost:3003";
const DASHBOARD_ID = import.meta.env.VITE_DASHBOARD_ID ?? "your-dashboard-id";

export default function SampleDashboardProvider() {
  return (
    <DashboardProvider
      apiKey={API_KEY}
      endpoint={ENDPOINT}
      dashboardId={DASHBOARD_ID}
      showHeading
      detectUserPrefColorsSchema
    />
  );
}
